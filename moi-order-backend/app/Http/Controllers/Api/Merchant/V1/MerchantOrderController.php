<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\FoodOrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\UpdateFoodOrderStatusRequest;
use App\Http\Resources\FoodOrderResource;
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
            'data' => FoodOrderResource::collection($orders->items())
                ->map(fn ($r) => (new FoodOrderResource($r->resource, $this->storage))->toArray($request))
                ->values(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /** PUT /api/merchant/v1/orders/{id}/status */
    public function updateStatus(UpdateFoodOrderStatusRequest $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->findOrFail($id);

        $order = $this->orderService->updateStatus(
            $order,
            FoodOrderStatus::from($request->validated('status')),
        );

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }
}
