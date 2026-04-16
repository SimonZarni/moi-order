<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadEticketRequest;
use App\Http\Resources\TicketOrderResource;
use App\Models\TicketOrder;
use App\Services\TicketOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. Admin ticket order management. ≤20 lines/action.
 */
class AdminTicketOrderController extends Controller
{
    public function __construct(
        private readonly TicketOrderService $service,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = TicketOrder::with(['ticket', 'user'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->paginate(20);

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

    public function show(TicketOrder $ticketOrder): JsonResponse
    {
        $ticketOrder->load(['ticket', 'items.variant', 'user', 'payment']);

        return response()->json(['data' => new TicketOrderResource($ticketOrder)]);
    }

    /** POST /api/admin/v1/ticket-orders/{ticketOrder}/eticket */
    public function uploadEticket(UploadEticketRequest $request, TicketOrder $ticketOrder): JsonResponse
    {
        $order = $this->service->uploadEticket($ticketOrder, $request->file('eticket'));

        return response()->json(['data' => new TicketOrderResource($order)]);
    }
}
