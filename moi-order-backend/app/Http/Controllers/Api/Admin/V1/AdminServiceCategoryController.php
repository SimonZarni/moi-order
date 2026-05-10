<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminStoreServiceCategoryDTO;
use App\DTOs\AdminUpdateServiceCategoryDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderServicesRequest;
use App\Http\Requests\Admin\StoreServiceCategoryRequest;
use App\Http\Requests\Admin\UpdateServiceCategoryRequest;
use App\Http\Resources\Admin\AdminServiceCategoryResource;
use App\Models\ServiceCategory;
use App\Services\AdminServiceCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only for service category sub-resources.
 */
class AdminServiceCategoryController extends Controller
{
    public function __construct(
        private readonly AdminServiceCategoryService $categoryService,
    ) {}

    /** GET /api/admin/v1/service-categories */
    public function index(): AnonymousResourceCollection
    {
        return AdminServiceCategoryResource::collection($this->categoryService->index());
    }

    /** GET /api/admin/v1/service-categories/{slug} */
    public function show(string $slug): JsonResponse
    {
        $category = $this->categoryService->show($slug);

        return response()->json(['data' => new AdminServiceCategoryResource($category)]);
    }

    /** POST /api/admin/v1/service-categories */
    public function store(StoreServiceCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->store(AdminStoreServiceCategoryDTO::fromRequest($request));

        return response()->json(['data' => new AdminServiceCategoryResource($category)], 201);
    }

    /** PUT /api/admin/v1/service-categories/{slug} */
    public function update(UpdateServiceCategoryRequest $request, string $slug): JsonResponse
    {
        $category = ServiceCategory::where('slug', $slug)->firstOrFail();
        $updated  = $this->categoryService->update($category, AdminUpdateServiceCategoryDTO::fromRequest($request));

        return response()->json(['data' => new AdminServiceCategoryResource($updated)]);
    }

    /** PUT /api/admin/v1/service-categories/{slug}/services/reorder */
    public function reorderServices(ReorderServicesRequest $request, string $slug): JsonResponse
    {
        $category = ServiceCategory::where('slug', $slug)->firstOrFail();
        $this->categoryService->reorderServices($category, $request->input('order'));

        return response()->json(null, 204);
    }
}
