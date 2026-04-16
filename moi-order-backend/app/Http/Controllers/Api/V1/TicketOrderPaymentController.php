<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\TicketOrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\TicketOrder;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Security: every query scoped to the authenticated user (forUser scope).
 */
class TicketOrderPaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $service,
    ) {}

    /** POST /api/v1/ticket-orders/{id}/payment */
    public function store(int $id, Request $request): JsonResponse
    {
        $order = TicketOrder::with(['items', 'payment', 'user'])
            ->forUser($request->user()->id)
            ->whereIn('status', [TicketOrderStatus::PendingPayment, TicketOrderStatus::PaymentFailed])
            ->findOrFail($id);

        $alreadyExists = $order->payment !== null
            && $order->payment->status->value === 'pending';

        $payment = $this->service->createForPayable($order);

        return response()->json(
            ['data' => new PaymentResource($payment)],
            $alreadyExists ? 200 : 201,
        );
    }

    /** GET /api/v1/ticket-orders/{id}/payment */
    public function show(int $id, Request $request): JsonResponse
    {
        $order = TicketOrder::with('payment')
            ->forUser($request->user()->id)
            ->findOrFail($id);

        abort_if($order->payment === null, 404, 'No payment found for this order.');

        return response()->json(['data' => new PaymentResource($order->payment)]);
    }

    /** POST /api/v1/ticket-orders/{id}/payment/sync */
    public function sync(int $id, Request $request): JsonResponse
    {
        $order = TicketOrder::with(['items', 'payment', 'user'])
            ->forUser($request->user()->id)
            ->findOrFail($id);

        $this->service->syncWithStripe($order);

        return response()->json(['synced' => true]);
    }
}
