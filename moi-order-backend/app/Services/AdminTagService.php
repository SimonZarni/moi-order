<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreTagDTO;
use App\DTOs\AdminUpdateTagDTO;
use App\Models\Tag;
use App\Support\CacheKeys;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

/**
 * Principle: SRP — owns admin CRUD for tags only.
 */
class AdminTagService
{
    public function index(int $perPage = 20): LengthAwarePaginator
    {
        $page = request()->integer('page', 1);

        return Cache::tags([CacheKeys::TAG_TAGS])
            ->remember("tags:page:{$page}:per_page:{$perPage}", now()->addHours(24), fn () =>
                Tag::withTrashed()->withCount('places')->latest()->paginate($perPage)
            );
    }

    public function show(Tag $tag): Tag
    {
        return $tag->loadCount('places');
    }

    public function store(AdminStoreTagDTO $dto): Tag
    {
        $tag = Tag::create([
            'name_my' => $dto->nameMy,
            'name_en' => $dto->nameEn,
            'name_th' => $dto->nameTh,
            'slug'    => $dto->slug,
        ]);

        Cache::tags([CacheKeys::TAG_TAGS])->flush();

        return $tag;
    }

    public function update(Tag $tag, AdminUpdateTagDTO $dto): Tag
    {
        $fields = array_filter([
            'name_my' => $dto->nameMy,
            'name_en' => $dto->nameEn,
            'name_th' => $dto->nameTh,
            'slug'    => $dto->slug,
        ], fn ($v) => $v !== null);

        if (! empty($fields)) {
            $tag->update($fields);
        }

        Cache::tags([CacheKeys::TAG_TAGS])->flush();

        return $tag->fresh()->loadCount('places');
    }

    public function destroy(Tag $tag): void
    {
        $tag->delete();
        Cache::tags([CacheKeys::TAG_TAGS])->flush();
    }

    public function restore(Tag $tag): Tag
    {
        $tag->restore();
        Cache::tags([CacheKeys::TAG_TAGS])->flush();

        return $tag->fresh()->loadCount('places');
    }
}
