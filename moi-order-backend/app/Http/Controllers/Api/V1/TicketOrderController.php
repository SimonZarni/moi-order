<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateTicketOrderDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\CancelTicketOrderRequest;
use App\Http\Requests\CreateTicketOrderRequest;
use App\Http\Requests\DeleteTicketOrderRequest;
use App\Http\Resources\TicketOrderResource;
use App\Models\TicketOrder;
use App\Services\TicketOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Security: every query scoped to the authenticated user (forUser scope).
 */
class TicketOrderController extends Controller
{
    public function __construct(
        private readonly TicketOrderService $service,
    ) {}

    public function store(CreateTicketOrderRequest $request): JsonResponse
    {
        $order = $this->service->create(
            CreateTicketOrderDTO::fromRequest($request),
            $request->user(),
        );

        return response()->json(['data' => new TicketOrderResource($order)], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = TicketOrder::with(['ticket', 'items.variant'])
            ->forUser($request->user()->id)
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'data' => TicketOrderResource::collection($orders->items()),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    public function show(string $id, Request $request): JsonResponse
    {
        $order = TicketOrder::with(['ticket', 'items.variant', 'payment'])
            ->forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();

        return response()->json(['data' => new TicketOrderResource($order)]);
    }

    /** POST /api/v1/ticket-orders/{id}/cancel */
    public function cancel(CancelTicketOrderRequest $request, string $id): JsonResponse
    {
        $order = TicketOrder::with(['ticket', 'items.variant'])
            ->forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();

        $order = $this->service->cancel($order);

        return response()->json(['data' => new TicketOrderResource($order)]);
    }

    /** DELETE /api/v1/ticket-orders/{id} */
    public function destroy(DeleteTicketOrderRequest $request, string $id): JsonResponse
    {
        $order = TicketOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();
        $this->service->deleteCancelled($order);

        return response()->json(null, 204);
    }
}
