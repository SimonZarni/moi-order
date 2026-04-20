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
 * Principle: SRP — admin payment read logic only. Payments are never mutated by admin.
 */
class AdminPaymentService
{
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
