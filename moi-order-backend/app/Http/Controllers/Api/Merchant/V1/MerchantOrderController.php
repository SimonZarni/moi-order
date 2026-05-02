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
        $restaurant = $request->user()->restaurant()->firstOrFail();

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
    public function show(Request $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->with(['items', 'user'])->findOrFail($id);

        return response()->json([
            'data' => (new FoodOrderResource($order, $this->storage))->toArray($request),
        ]);
    }

    /** PUT /api/merchant/v1/orders/{id}/status */
    public function updateStatus(UpdateFoodOrderStatusRequest $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->findOrFail($id);

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
