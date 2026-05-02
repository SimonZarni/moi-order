<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\DTOs\CompleteFoodOrderDTO;
use App\DTOs\StoreFoodOrderDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\CompleteFoodOrderRequest;
use App\Http\Requests\Api\StoreFoodOrderRequest;
use App\Http\Resources\FoodOrderResource;
use App\Models\FoodOrder;
use App\Services\FoodOrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FoodOrderController extends Controller
{
    public function __construct(
        private readonly FoodOrderService    $orderService,
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/v1/food-orders */
    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->listForUser($request->user()->id);

        return response()->json([
            'data' => collect($orders->items())
                ->map(fn ($o) => (new FoodOrderResource($o, $this->storage))->toArray($request))
                ->values(),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }

    /** GET /api/v1/food-orders/{id} */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)->with(['items', 'restaurant', 'user'])->findOrFail($id);

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }

    /** POST /api/v1/food-orders */
    public function store(StoreFoodOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->place(StoreFoodOrderDTO::fromRequest($request));

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)], 201);
    }

    /** POST /api/v1/food-orders/{id}/complete */
    public function complete(CompleteFoodOrderRequest $request, int $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)->findOrFail($id);
        $dto   = CompleteFoodOrderDTO::fromRequest($request);

        $order = $this->orderService->completeByCustomer($order, $dto->rating, $dto->review);

        return response()->json(['data' => new FoodOrderResource($order, $this->storage)]);
    }
}
