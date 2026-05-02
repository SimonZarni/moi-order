<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreServiceDTO;
use App\DTOs\AdminUpdateServiceDTO;
use App\Exceptions\DomainException;
use App\Models\Service;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Principle: SRP — owns admin CRUD for service catalog entries only.
 */
class AdminServiceService
{
    public function index(): LengthAwarePaginator
    {
        return Service::withCount('types')
            ->orderBy('position')
            ->orderBy('id')
            ->paginate(20);
    }

    public function store(AdminStoreServiceDTO $dto): Service
    {
        $nextPosition = (Service::max('position') ?? 0) + 1;

        return Service::create([
            'name'                => $dto->name,
            'name_en'             => $dto->nameEn,
            'name_mm'             => $dto->nameMm,
            'slug'                => $dto->slug,
            'is_active'           => $dto->isActive,
            'position'            => $nextPosition,
            'service_category_id' => $dto->serviceCategoryId,
        ]);
    }

    public function update(Service $service, AdminUpdateServiceDTO $dto): Service
    {
        $fields = array_filter([
            'name'      => $dto->name,
            'name_en'   => $dto->nameEn,
            'name_mm'   => $dto->nameMm,
            'slug'      => $dto->slug,
            'is_active' => $dto->isActive,
        ], fn ($v) => $v !== null);

        // null is a valid value for service_category_id (moves service to OtherServices),
        // so we cannot rely on array_filter — use explicit flag from the DTO.
        if ($dto->hasCategoryChange) {
            $fields['service_category_id'] = $dto->serviceCategoryId;
        }

        $service->update($fields);

        return $service->fresh(['serviceCategory']);
    }

    public function findBySlug(string $slug): Service
    {
        return Service::where('slug', $slug)
            ->with(['types' => fn (HasMany $q) => $q->orderBy('position')])
            ->firstOrFail();
    }

    public function toggle(Service $service): Service
    {
        $service->update(['is_active' => ! $service->is_active]);

        return $service->fresh();
    }

    public function destroy(Service $service): void
    {
        $hasSubmissions = $service->types()->withTrashed()
            ->whereHas('submissions')
            ->exists();

        if ($hasSubmissions) {
            throw new DomainException('service.has_submissions');
        }

        $service->delete();
    }
}
