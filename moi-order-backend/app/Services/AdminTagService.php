<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreTagDTO;
use App\DTOs\AdminUpdateTagDTO;
use App\Models\Tag;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Principle: SRP — owns admin CRUD for tags only.
 */
class AdminTagService
{
    public function index(int $perPage = 20): LengthAwarePaginator
    {
        return Tag::withTrashed()
            ->withCount('places')
            ->latest()
            ->paginate($perPage);
    }

    public function show(Tag $tag): Tag
    {
        return $tag->loadCount('places');
    }

    public function store(AdminStoreTagDTO $dto): Tag
    {
        return Tag::create([
            'name_my' => $dto->nameMy,
            'name_en' => $dto->nameEn,
            'name_th' => $dto->nameTh,
            'slug'    => $dto->slug,
        ]);
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

        return $tag->fresh()->loadCount('places');
    }

    public function destroy(Tag $tag): void
    {
        $tag->delete();
    }

    public function restore(Tag $tag): Tag
    {
        $tag->restore();

        return $tag->fresh()->loadCount('places');
    }
}
