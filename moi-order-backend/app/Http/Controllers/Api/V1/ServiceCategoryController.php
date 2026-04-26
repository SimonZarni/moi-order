<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceCategoryResource;
use App\Models\ServiceCategory;

/**
 * Principle: SRP — HTTP layer only. Zero business logic.
 * Public endpoint — intentionally unauthenticated (throttle:api in middleware).
 */
class ServiceCategoryController extends Controller
{
    /**
     * GET /api/v1/service-categories/{slug}
     * Returns an active category with its active services and their types.
     */
    public function show(string $slug): ServiceCategoryResource
    {
        $category = ServiceCategory::with([
                'services' => fn ($q) => $q->active()->with([
                    'types' => fn ($q) => $q->active()->orderBy('id'),
                ])->orderBy('id'),
            ])
            ->active()
            ->where('slug', $slug)
            ->firstOrFail();

        return new ServiceCategoryResource($category);
    }
}
