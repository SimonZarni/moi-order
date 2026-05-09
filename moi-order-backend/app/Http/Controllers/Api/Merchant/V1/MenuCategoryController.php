<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\StoreMenuCategoryRequest;
use App\Http\Resources\MenuCategoryResource;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuCategoryController extends Controller
{
    public function __construct(
        private readonly MenuService          $menuService,
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/merchant/v1/menu/categories */
    public function index(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->with(['menuCategories.menuItems.optionGroups.options'])->first();

        if ($restaurant === null) {
            return response()->json(['data' => []]);
        }

        $data = $restaurant->menuCategories->map(
            fn ($cat) => (new MenuCategoryResource($cat, $this->storage))->toArray($request)
        );

        return response()->json(['data' => $data]);
    }

    /** POST /api/merchant/v1/menu/categories */
    public function store(StoreMenuCategoryRequest $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();

        $category = $this->menuService->createCategory($restaurant, $request->validated());

        return response()->json(['data' => new MenuCategoryResource($category, $this->storage)], 201);
    }

    /** PUT /api/merchant/v1/menu/categories/{id} */
    public function update(StoreMenuCategoryRequest $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $category   = $restaurant->menuCategories()->findOrFail($id);

        $category = $this->menuService->updateCategory($category, $request->validated());

        return response()->json(['data' => new MenuCategoryResource($category, $this->storage)]);
    }

    /** DELETE /api/merchant/v1/menu/categories/{id} */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $category   = $restaurant->menuCategories()->findOrFail($id);

        $this->menuService->deleteCategory($category);

        return response()->json(null, 204);
    }
}
