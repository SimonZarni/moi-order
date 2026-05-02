<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderServicesRequest;
use App\Http\Resources\Admin\AdminServiceCategoryResource;
use App\Models\ServiceCategory;
use App\Services\AdminServiceCategoryService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only for service category sub-resources.
 */
class AdminServiceCategoryController extends Controller
{
    public function __construct(
        private readonly AdminServiceCategoryService $categoryService,
    ) {}

    /** GET /api/admin/v1/service-categories/{slug} */
    public function show(string $slug): JsonResponse
    {
        $category = $this->categoryService->show($slug);

        return response()->json(['data' => new AdminServiceCategoryResource($category)]);
    }

    /** PUT /api/admin/v1/service-categories/{slug}/services/reorder */
    public function reorderServices(ReorderServicesRequest $request, string $slug): JsonResponse
    {
        $category = ServiceCategory::where('slug', $slug)->firstOrFail();
        $this->categoryService->reorderServices($category, $request->input('order'));

        return response()->json(null, 204);
    }
}
