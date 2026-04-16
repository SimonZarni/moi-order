<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreServiceDTO;
use App\DTOs\AdminUpdateServiceDTO;
use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Principle: SRP — owns admin CRUD for service catalog entries only.
 */
class AdminServiceService
{
    public function index(): LengthAwarePaginator
    {
        return Service::withCount('types')
            ->withTrashed()
            ->latest()
            ->paginate(20);
    }

    public function store(AdminStoreServiceDTO $dto): Service
    {
        return Service::create([
            'name'      => $dto->name,
            'name_en'   => $dto->nameEn,
            'slug'      => $dto->slug,
            'is_active' => $dto->isActive,
        ]);
    }

    public function update(Service $service, AdminUpdateServiceDTO $dto): Service
    {
        $service->update(array_filter([
            'name'      => $dto->name,
            'name_en'   => $dto->nameEn,
            'slug'      => $dto->slug,
            'is_active' => $dto->isActive,
        ], fn ($v) => $v !== null));

        return $service->fresh();
    }

    public function destroy(Service $service): void
    {
        $service->delete();
    }
}
