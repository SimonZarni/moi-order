<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminMenuCategoryRequest;
use App\Http\Resources\MenuCategoryResource;
use App\Models\MenuCategory;
use App\Models\Restaurant;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;

/**
 * SRP — HTTP layer only. Admin menu category management scoped to a restaurant.
 */
class AdminMenuCategoryController extends Controller
{
    public function __construct(private readonly MenuService $menuService) {}

    public function store(StoreAdminMenuCategoryRequest $request, Restaurant $restaurant): JsonResponse
    {
        $category = $this->menuService->createCategory($restaurant, $request->validated());

        return response()->json(['data' => new MenuCategoryResource($category)], 201);
    }

    public function update(StoreAdminMenuCategoryRequest $request, Restaurant $restaurant, int $categoryId): JsonResponse
    {
        $category = $restaurant->menuCategories()->findOrFail($categoryId);

        $category = $this->menuService->updateCategory($category, $request->validated());

        return response()->json(['data' => new MenuCategoryResource($category)]);
    }

    public function destroy(Restaurant $restaurant, int $categoryId): JsonResponse
    {
        $category = $restaurant->menuCategories()->findOrFail($categoryId);

        $this->menuService->deleteCategory($category);

        return response()->json(null, 204);
    }
}
