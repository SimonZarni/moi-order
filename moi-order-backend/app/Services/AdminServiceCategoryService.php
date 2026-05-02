<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\DomainException;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns admin read + reorder for service categories only.
 */
class AdminServiceCategoryService
{
    public function show(string $slug): ServiceCategory
    {
        return ServiceCategory::where('slug', $slug)
            ->with(['services' => fn ($q) => $q->orderBy('position')])
            ->firstOrFail();
    }

    public function reorderServices(ServiceCategory $category, array $orderedIds): void
    {
        $categoryServiceIds = $category->services()->withTrashed()->pluck('id')->toArray();
        $invalid            = array_diff($orderedIds, $categoryServiceIds);

        if (! empty($invalid)) {
            throw new DomainException('service_category.invalid_service_ids');
        }

        DB::transaction(function () use ($category, $orderedIds): void {
            foreach ($orderedIds as $position => $id) {
                Service::where('id', $id)
                    ->where('service_category_id', $category->id)
                    ->update(['position' => $position + 1]);
            }
        });
    }
}
