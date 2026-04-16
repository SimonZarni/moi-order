<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminStoreCategoryDTO;
use App\DTOs\AdminUpdateCategoryDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreCategoryRequest;
use App\Http\Requests\Admin\AdminUpdateCategoryRequest;
use App\Http\Resources\Admin\AdminCategoryResource;
use App\Models\Category;
use App\Services\AdminCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class AdminCategoryController extends Controller
{
    public function __construct(private readonly AdminCategoryService $service) {}

    /** GET /api/admin/v1/categories */
    public function index(Request $request): AnonymousResourceCollection
    {
        return AdminCategoryResource::collection(
            $this->service->index($request->integer('per_page', 20))
        );
    }

    /** POST /api/admin/v1/categories */
    public function store(AdminStoreCategoryRequest $request): JsonResponse
    {
        $category = $this->service->store(AdminStoreCategoryDTO::fromRequest($request));

        return response()->json(['data' => new AdminCategoryResource($category)], 201);
    }

    /** GET /api/admin/v1/categories/{category} */
    public function show(Category $category): JsonResponse
    {
        return response()->json(['data' => new AdminCategoryResource($this->service->show($category))]);
    }

    /** PUT /api/admin/v1/categories/{category} */
    public function update(AdminUpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $updated = $this->service->update($category, AdminUpdateCategoryDTO::fromRequest($request));

        return response()->json(['data' => new AdminCategoryResource($updated)]);
    }

    /** DELETE /api/admin/v1/categories/{category} */
    public function destroy(Category $category): JsonResponse
    {
        $this->service->destroy($category);

        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/categories/{id}/restore — withTrashed lookup required */
    public function restore(int $id): JsonResponse
    {
        $category = Category::withTrashed()->findOrFail($id);
        $restored = $this->service->restore($category);

        return response()->json(['data' => new AdminCategoryResource($restored)]);
    }
}
