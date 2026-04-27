<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Http\Requests\Admin\AdminPaymentIndexRequest;
use App\Models\Payment;
use App\Models\ServiceSubmission;
use App\Models\TicketOrder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — admin payment read/regenerate logic only.
 * Principle: DIP — depends on PaymentService interface for QR creation; never calls Stripe directly.
 */
class AdminPaymentService
{
    public function __construct(
        private readonly PaymentService $paymentService,
    ) {}

    private function withPayable(): array
    {
        return [
            'payable' => function (MorphTo $query): void {
                $query->morphWith([
                    ServiceSubmission::class => ['user', 'serviceType.service'],
                    TicketOrder::class       => ['user', 'ticket'],
                ]);
            },
        ];
    }

    public function index(AdminPaymentIndexRequest $request): LengthAwarePaginator
    {
        $query = Payment::with($this->withPayable())
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from')->toString());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search): void {
                $q->whereHasMorph(
                    'payable',
                    [ServiceSubmission::class, TicketOrder::class],
                    fn ($sub) => $sub->whereHas(
                        'user',
                        fn ($uq) => $uq->where('name', 'like', "%{$search}%")
                                       ->orWhere('email', 'like', "%{$search}%")
                    )
                )->orWhere('stripe_intent_id', 'like', "%{$search}%");
            });
        }

        return $query->paginate($request->integer('per_page', 20));
    }

    public function show(Payment $payment): Payment
    {
        return $payment->load($this->withPayable());
    }

    /**
     * Admin manually confirms a pending payment — triggers onPaymentConfirmed on the payable.
     * Security: only callable on pending payments; terminal statuses are rejected.
     */
    public function confirm(Payment $payment): Payment
    {
        if ($payment->status !== PaymentStatus::Pending) {
            throw new \DomainException('payment.not_confirmable', 409);
        }

        DB::transaction(function () use ($payment): void {
            $locked = Payment::with('payable')
                ->where('id', $payment->id)
                ->where('status', PaymentStatus::Pending)
                ->lockForUpdate()
                ->firstOrFail();

            $locked->markSucceeded([]);

            Log::info('payment.admin_confirmed', ['payment_id' => $locked->id]);

            $locked->payable?->onPaymentConfirmed();
        });

        return $payment->fresh($this->withPayable());
    }

    /**
     * Create a fresh Stripe PromptPay intent for an expired pending QR.
     * The old Payment row is left untouched; a new Payment is returned.
     *
     * Security: only callable on pending + expired payments — prevents double-charging
     * a payable that has already succeeded or is still within its valid QR window.
     */
    public function regenerate(Payment $payment): Payment
    {
        if ($payment->status !== PaymentStatus::Pending) {
            throw new \DomainException('payment.not_regeneratable', 409);
        }

        // Null expires_at (legacy rows): treat as expired after 1 hour — mirrors
        // the same logic in PaymentService::findPendingPayment().
        $isExpired = $payment->expires_at !== null
            ? $payment->expires_at->isPast()
            : $payment->created_at->lt(now()->subHour());

        if (! $isExpired) {
            throw new \DomainException('payment.qr_not_expired', 409);
        }

        $payment->loadMissing('payable');

        if ($payment->payable === null) {
            throw new \DomainException('payment.payable_not_found', 422);
        }

        // PaymentService::createForPayable() will find no valid pending payment
        // (the existing one is expired) and create a fresh Stripe intent.
        $newPayment = $this->paymentService->createForPayable($payment->payable);

        Log::info('payment.admin_regenerated', [
            'old_payment_id' => $payment->id,
            'new_payment_id' => $newPayment->id,
        ]);

        return $newPayment->load($this->withPayable());
    }

    /** Aggregate totals across ALL payments — not scoped to current page. */
    public function stats(): array
    {
        $rows = Payment::selectRaw('status, SUM(amount) as total_amount, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        return [
            'total_revenue'   => (int) ($rows->get('succeeded')?->total_amount ?? 0),
            'succeeded_count' => (int) ($rows->get('succeeded')?->count ?? 0),
            'pending_count'   => (int) ($rows->get('pending')?->count ?? 0),
            'failed_count'    => (int) ($rows->get('failed')?->count ?? 0),
        ];
    }
}
