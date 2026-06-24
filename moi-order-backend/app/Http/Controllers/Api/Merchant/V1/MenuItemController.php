<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\StoreMenuItemRequest;
use App\Http\Requests\Merchant\UpdateMenuItemRequest;
use App\Http\Requests\Merchant\UpdateMenuItemStatusRequest;
use App\Http\Requests\Merchant\UpdateMenuItemStockRequest;
use App\Enums\MenuItemStatus;
use App\Http\Resources\MenuItemResource;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function __construct(
        private readonly MenuService          $menuService,
        private readonly FileStorageInterface $storage,
    ) {}

    /** POST /api/merchant/v1/menu/categories/{categoryId}/items */
    public function store(StoreMenuItemRequest $request, int $categoryId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $category   = $restaurant->menuCategories()->findOrFail($categoryId);

        $item = $this->menuService->createItem($restaurant, $category, $request->validated());

        return response()->json(['data' => new MenuItemResource($item, $this->storage)], 201);
    }

    /** PUT /api/merchant/v1/menu/items/{id} */
    public function update(UpdateMenuItemRequest $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $item       = $restaurant->menuItems()->findOrFail($id);

        $item = $this->menuService->updateItem($item, $request->validated());

        return response()->json(['data' => new MenuItemResource($item, $this->storage)]);
    }

    /** PATCH /api/merchant/v1/menu/items/{id}/status */
    public function updateStatus(UpdateMenuItemStatusRequest $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $item       = $restaurant->menuItems()->findOrFail($id);

        $item->update(['status' => MenuItemStatus::from($request->validated()['status'])]);

        return response()->json(['data' => new MenuItemResource($item->fresh(), $this->storage)]);
    }

    /** PATCH /api/merchant/v1/menu/items/{id}/stock */
    public function updateStock(UpdateMenuItemStockRequest $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $item       = $restaurant->menuItems()->findOrFail($id);

        $item->update(['stock_quantity' => $request->validated()['stock_quantity']]);

        return response()->json(['data' => new MenuItemResource($item->fresh(), $this->storage)]);
    }

    /** DELETE /api/merchant/v1/menu/items/{id} */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $item       = $restaurant->menuItems()->findOrFail($id);

        $this->menuService->deleteItem($item);

        return response()->json(null, 204);
    }
}
