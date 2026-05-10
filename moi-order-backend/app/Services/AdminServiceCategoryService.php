<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreServiceCategoryDTO;
use App\DTOs\AdminUpdateServiceCategoryDTO;
use App\Exceptions\DomainException;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Support\CacheKeys;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns admin CRUD + reorder for service categories only.
 */
class AdminServiceCategoryService
{
    public function index(): Collection
    {
        return Cache::remember(CacheKeys::SERVICE_CATEGORIES_ACTIVE, now()->addHours(24), fn (): Collection =>
            ServiceCategory::active()->orderBy('name_en')->get()
        );
    }

    public function show(string $slug): ServiceCategory
    {
        return ServiceCategory::where('slug', $slug)
            ->with(['services' => fn ($q) => $q->orderBy('position')])
            ->firstOrFail();
    }

    public function store(AdminStoreServiceCategoryDTO $dto): ServiceCategory
    {
        $category = ServiceCategory::create([
            'name'              => $dto->name,
            'name_en'           => $dto->nameEn,
            'name_mm'           => $dto->nameMm,
            'slug'              => $dto->slug,
            'navigation_screen' => $dto->navigationScreen,
            'is_active'         => $dto->isActive,
        ]);

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);

        return $category;
    }

    public function update(ServiceCategory $category, AdminUpdateServiceCategoryDTO $dto): ServiceCategory
    {
        $category->update([
            'name'              => $dto->name,
            'name_en'           => $dto->nameEn,
            'name_mm'           => $dto->nameMm,
            'slug'              => $dto->slug,
            'navigation_screen' => $dto->navigationScreen,
            'is_active'         => $dto->isActive,
        ]);

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);

        return $category->fresh();
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

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);
    }
}
