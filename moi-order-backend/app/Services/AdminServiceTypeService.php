<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreServiceTypeDTO;
use App\DTOs\AdminUpdateServiceTypeDTO;
use App\Models\Service;
use App\Models\ServiceType;
use Illuminate\Database\Eloquent\Collection;

/**
 * Principle: SRP — owns admin CRUD for service type sub-resources only.
 */
class AdminServiceTypeService
{
    public function index(Service $service): Collection
    {
        return $service->types()->withTrashed()->get();
    }

    public function store(Service $service, AdminStoreServiceTypeDTO $dto): ServiceType
    {
        return $service->types()->create([
            'name'      => $dto->name,
            'name_en'   => $dto->nameEn,
            'price'     => $dto->price,
            'is_active' => $dto->isActive,
        ]);
    }

    public function update(ServiceType $type, AdminUpdateServiceTypeDTO $dto): ServiceType
    {
        $type->update(array_filter([
            'name'      => $dto->name,
            'name_en'   => $dto->nameEn,
            'price'     => $dto->price,
            'is_active' => $dto->isActive,
        ], fn ($v) => $v !== null));

        return $type->fresh();
    }

    public function destroy(ServiceType $type): void
    {
        $type->delete();
    }
}
