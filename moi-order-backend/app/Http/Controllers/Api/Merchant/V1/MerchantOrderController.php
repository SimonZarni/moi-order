<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\FoodOrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\UpdateFoodOrderStatusRequest;
use App\Http\Resources\FoodOrderResource;
use App\Models\FoodOrder;
use App\Services\FoodOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MerchantOrderController extends Controller
{
    public function __construct(
        private readonly FoodOrderService    $orderService,
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/merchant/v1/orders */
    public function index(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();

        if ($restaurant === null) {
            return response()->json(['data' => [], 'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => 20, 'total' => 0]]);
        }

        $orders = $this->orderService->listForRestaurant($restaurant->id);

        return response()->json([
            'data' => collect($orders->items())
                ->map(fn (FoodOrder $order) => (new FoodOrderResource($order, $this->storage))->toArray($request))
                ->values(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /** GET /api/merchant/v1/orders/{id} */
    public function show(Request $request, string $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->with(['items', 'user'])->where('uuid', $id)->firstOrFail();

        return response()->json([
            'data' => (new FoodOrderResource($order, $this->storage))->toArray($request),
        ]);
    }

    /** POST /api/merchant/v1/orders/{id}/confirm-payment */
    public function confirmPayment(Request $request, string $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->with(['items', 'user'])->where('uuid', $id)->firstOrFail();

        if ($order->status !== FoodOrderStatus::WaitingForPayment) {
            throw new \App\Exceptions\DomainException('order.not_waiting_for_payment', 409);
        }

        $updated = $this->orderService->updateStatus($order, FoodOrderStatus::PaymentConfirmed);

        return response()->json(['data' => new FoodOrderResource($updated, $this->storage)]);
    }

    /** PUT /api/merchant/v1/orders/{id}/status */
    public function updateStatus(UpdateFoodOrderStatusRequest $request, string $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->where('uuid', $id)->firstOrFail();

        $newStatus = FoodOrderStatus::from($request->validated('status'));

        if ($newStatus === FoodOrderStatus::Cancelled) {
            $order = $this->orderService->cancelByMerchant(
                $order,
                $request->validated('cancel_reason'),
                $request->validated('cancel_description'),
            );
        } else {
            $order = $this->orderService->updateStatus($order, $newStatus);
        }

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }
}
