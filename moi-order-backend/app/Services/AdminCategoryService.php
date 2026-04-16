<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreCategoryDTO;
use App\DTOs\AdminUpdateCategoryDTO;
use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Principle: SRP — owns admin CRUD for categories only.
 */
class AdminCategoryService
{
    public function index(int $perPage = 20): LengthAwarePaginator
    {
        return Category::withTrashed()
            ->withCount('places')
            ->latest()
            ->paginate($perPage);
    }

    public function show(Category $category): Category
    {
        return $category->loadCount('places');
    }

    public function store(AdminStoreCategoryDTO $dto): Category
    {
        return Category::create([
            'name_my' => $dto->nameMy,
            'name_en' => $dto->nameEn,
            'name_th' => $dto->nameTh,
            'slug'    => $dto->slug,
        ]);
    }

    public function update(Category $category, AdminUpdateCategoryDTO $dto): Category
    {
        $fields = array_filter([
            'name_my' => $dto->nameMy,
            'name_en' => $dto->nameEn,
            'name_th' => $dto->nameTh,
            'slug'    => $dto->slug,
        ], fn ($v) => $v !== null);

        if (! empty($fields)) {
            $category->update($fields);
        }

        return $category->fresh()->loadCount('places');
    }

    public function destroy(Category $category): void
    {
        $category->delete();
    }

    public function restore(Category $category): Category
    {
        $category->restore();

        return $category->fresh()->loadCount('places');
    }
}
