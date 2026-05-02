<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreServiceTypeDTO;
use App\DTOs\AdminUpdateServiceTypeDTO;
use App\Exceptions\DomainException;
use App\Models\Service;
use App\Models\ServiceType;
use App\Support\CacheKeys;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns admin CRUD for service type sub-resources only.
 */
class AdminServiceTypeService
{
    public function index(Service $service): Collection
    {
        return $service->types()->get();
    }

    public function store(Service $service, AdminStoreServiceTypeDTO $dto): ServiceType
    {
        $nextPosition = ($service->types()->max('position') ?? 0) + 1;

        $type = $service->types()->create([
            'name'         => $dto->name,
            'name_en'      => $dto->nameEn,
            'name_mm'      => $dto->nameMm,
            'price'        => $dto->price,
            'is_active'    => $dto->isActive,
            'field_schema' => $dto->fieldSchema,
            'position'     => $nextPosition,
        ]);

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);

        return $type;
    }

    public function update(ServiceType $type, AdminUpdateServiceTypeDTO $dto): ServiceType
    {
        $type->update(array_filter([
            'name'         => $dto->name,
            'name_en'      => $dto->nameEn,
            'name_mm'      => $dto->nameMm,
            'price'        => $dto->price,
            'is_active'    => $dto->isActive,
            'field_schema' => $dto->fieldSchema,
        ], fn ($v) => $v !== null));

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);

        return $type->fresh();
    }

    public function toggle(ServiceType $type): ServiceType
    {
        $type->update(['is_active' => ! $type->is_active]);

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);

        return $type->fresh();
    }

    public function reorder(Service $service, array $orderedIds): void
    {
        $serviceTypeIds = $service->types()->withTrashed()->pluck('id')->toArray();
        $invalid        = array_diff($orderedIds, $serviceTypeIds);

        if (! empty($invalid)) {
            throw new DomainException('service_type.invalid_ids');
        }

        DB::transaction(function () use ($service, $orderedIds): void {
            foreach ($orderedIds as $position => $id) {
                ServiceType::where('id', $id)
                    ->where('service_id', $service->id)
                    ->update(['position' => $position + 1]);
            }
        });

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);
    }

    public function destroy(ServiceType $type): void
    {
        if ($type->submissions()->exists()) {
            throw new DomainException('service_type.has_submissions');
        }

        $type->delete();

        Cache::forget(CacheKeys::SERVICE_CATEGORIES_ACTIVE);
    }
}
