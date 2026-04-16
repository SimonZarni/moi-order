<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Requests\Admin\AdminPaymentIndexRequest;
use App\Models\Payment;
use App\Models\ServiceSubmission;
use App\Models\TicketOrder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Relations\MorphTo;

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
                    TicketOrder::class       => ['ticket'],
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

        return $query->paginate($request->integer('per_page', 20));
    }

    public function show(Payment $payment): Payment
    {
        return $payment->load($this->withPayable());
    }
}
