<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\AdminStoreCategoryDTO;
use App\DTOs\AdminUpdateCategoryDTO;
use App\Models\Category;
use App\Support\CacheKeys;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;

/**
 * Principle: SRP — owns admin CRUD for categories only.
 * Principle: DIP — depends on FileStorageInterface, not Storage::disk() directly.
 */
class AdminCategoryService
{
    public function __construct(private readonly FileStorageInterface $fileStorage) {}

    public function index(int $perPage = 20): LengthAwarePaginator
    {
        $page = request()->integer('page', 1);

        return Cache::tags([CacheKeys::TAG_CATEGORIES])
            ->remember("categories:page:{$page}:per_page:{$perPage}", now()->addHours(24), fn () =>
                Category::withTrashed()->withCount('places')->latest()->paginate($perPage)
            );
    }

    public function show(Category $category): Category
    {
        return $category->loadCount('places');
    }

    public function store(AdminStoreCategoryDTO $dto): Category
    {
        $category = Category::create([
            'name_my' => $dto->nameMy,
            'name_en' => $dto->nameEn,
            'name_th' => $dto->nameTh,
            'slug'    => $dto->slug,
        ]);

        Cache::tags([CacheKeys::TAG_CATEGORIES])->flush();

        return $category;
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

        Cache::tags([CacheKeys::TAG_CATEGORIES])->flush();

        return $category->fresh()->loadCount('places');
    }

    public function uploadImage(Category $category, UploadedFile $file): Category
    {
        if ($category->image) {
            $this->fileStorage->delete($category->image);
        }

        $path = $this->fileStorage->store($file, 'categories', ['image/jpeg', 'image/png', 'image/webp']);
        $category->update(['image' => $path]);

        Cache::tags([CacheKeys::TAG_CATEGORIES])->flush();

        return $category->fresh()->loadCount('places');
    }

    public function removeImage(Category $category): Category
    {
        if ($category->image) {
            $this->fileStorage->delete($category->image);
            $category->update(['image' => null]);
            Cache::tags([CacheKeys::TAG_CATEGORIES])->flush();
        }

        return $category->fresh()->loadCount('places');
    }

    public function destroy(Category $category): void
    {
        $category->delete();
        Cache::tags([CacheKeys::TAG_CATEGORIES])->flush();
    }

    public function restore(Category $category): Category
    {
        $category->restore();
        Cache::tags([CacheKeys::TAG_CATEGORIES])->flush();

        return $category->fresh()->loadCount('places');
    }
}
