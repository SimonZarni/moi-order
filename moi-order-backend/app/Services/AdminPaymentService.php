<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Requests\Admin\AdminPaymentIndexRequest;
use App\Models\Payment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Principle: SRP — admin payment read logic only. Payments are never mutated by admin.
 */
class AdminPaymentService
{
    public function index(AdminPaymentIndexRequest $request): LengthAwarePaginator
    {
        $query = Payment::with(['submission.user', 'submission.serviceType.service'])
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
        return $payment->load(['submission.user', 'submission.serviceType.service']);
    }
}
