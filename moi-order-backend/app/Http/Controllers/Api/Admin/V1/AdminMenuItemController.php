<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminMenuItemRequest;
use App\Http\Requests\Admin\UpdateAdminMenuItemRequest;
use App\Http\Resources\MenuItemResource;
use App\Models\Restaurant;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;

/**
 * SRP — HTTP layer only. Admin menu item management scoped to a restaurant.
 */
class AdminMenuItemController extends Controller
{
    public function __construct(
        private readonly MenuService          $menuService,
        private readonly FileStorageInterface $storage,
    ) {}

    public function store(StoreAdminMenuItemRequest $request, Restaurant $restaurant): JsonResponse
    {
        $category = $restaurant->menuCategories()->findOrFail($request->integer('menu_category_id'));

        $item = $this->menuService->createItem($restaurant, $category, $request->validated());

        return response()->json(['data' => (new MenuItemResource($item, $this->storage))->toArray($request)], 201);
    }

    public function update(UpdateAdminMenuItemRequest $request, Restaurant $restaurant, int $itemId): JsonResponse
    {
        $item = $restaurant->menuItems()->findOrFail($itemId);

        $item = $this->menuService->updateItem($item, $request->validated());

        return response()->json(['data' => (new MenuItemResource($item, $this->storage))->toArray($request)]);
    }

    public function destroy(Restaurant $restaurant, int $itemId): JsonResponse
    {
        $item = $restaurant->menuItems()->findOrFail($itemId);

        $this->menuService->deleteItem($item);

        return response()->json(null, 204);
    }
}
