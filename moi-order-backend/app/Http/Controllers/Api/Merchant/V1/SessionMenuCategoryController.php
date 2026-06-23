<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\ImportSessionMenuCategoriesRequest;
use App\Http\Requests\Merchant\StoreSessionMenuCategoryRequest;
use App\Http\Resources\MenuCategoryResource;
use App\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionMenuCategoryController extends Controller
{
    public function __construct(
        private readonly MenuService          $menuService,
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/merchant/v1/opening-hours/{openingHourId}/session-menu */
    public function index(Request $request, int $openingHourId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $hour       = $this->menuService->resolveSessionHour($restaurant, $openingHourId);
        $categories = $this->menuService->getSessionCategories($hour);

        return response()->json([
            'data' => $categories->map(fn ($c) => (new MenuCategoryResource($c, $this->storage))->toArray($request)),
        ]);
    }

    /** POST /api/merchant/v1/opening-hours/{openingHourId}/session-menu */
    public function store(StoreSessionMenuCategoryRequest $request, int $openingHourId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $hour       = $this->menuService->resolveSessionHour($restaurant, $openingHourId);
        $category   = $this->menuService->createSessionCategory($hour, $request->string('name')->toString());

        return response()->json(['data' => new MenuCategoryResource($category, $this->storage)], 201);
    }

    /** POST /api/merchant/v1/opening-hours/{openingHourId}/session-menu/import */
    public function import(ImportSessionMenuCategoriesRequest $request, int $openingHourId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $hour       = $this->menuService->resolveSessionHour($restaurant, $openingHourId);
        $categories = $this->menuService->importCategoriesToSession(
            $restaurant,
            $hour,
            array_map('intval', $request->input('category_ids', [])),
        );

        return response()->json([
            'data' => $categories->map(fn ($c) => (new MenuCategoryResource($c, $this->storage))->toArray($request)),
        ], 201);
    }

    /** PATCH /api/merchant/v1/opening-hours/{openingHourId}/session-menu/{categoryId} */
    public function update(StoreSessionMenuCategoryRequest $request, int $openingHourId, int $categoryId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $hour       = $this->menuService->resolveSessionHour($restaurant, $openingHourId);
        $category   = $hour->sessionMenuCategories()->findOrFail($categoryId);
        $updated    = $this->menuService->updateSessionCategory($category, $request->string('name')->toString());

        return response()->json(['data' => new MenuCategoryResource($updated, $this->storage)]);
    }

    /** DELETE /api/merchant/v1/opening-hours/{openingHourId}/session-menu/{categoryId} */
    public function destroy(Request $request, int $openingHourId, int $categoryId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $hour       = $this->menuService->resolveSessionHour($restaurant, $openingHourId);
        $category   = $hour->sessionMenuCategories()->findOrFail($categoryId);
        $this->menuService->deleteSessionCategory($category);

        return response()->json(null, 204);
    }
}
