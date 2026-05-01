<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\HomeCardDTO;
use App\Enums\HomeCardIconType;
use App\Models\HomeCard;
use App\Models\HomeCardIcon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class HomeCardService
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    public function indexForAdmin(int $perPage = 20): LengthAwarePaginator
    {
        return HomeCard::withTrashed()->orderBy('position')->paginate($perPage);
    }

    public function indexForUser(): Collection
    {
        return HomeCard::visible()->with(['icon', 'route'])->get()
            ->each(function (HomeCard $card): void {
                /** @var HomeCardIcon|null $icon */
                $icon = $card->icon;
                if ($icon && $icon->type === HomeCardIconType::Custom && $icon->image_path) {
                    $icon->image_url = $this->storage->url($icon->image_path);
                }
            });
    }

    public function show(HomeCard $card): HomeCard
    {
        return $card;
    }

    public function store(HomeCardDTO $dto): HomeCard
    {
        $position = HomeCard::max('position') + 1;

        return HomeCard::create([
            'slug'              => $dto->slug,
            'position'          => $position,
            'title_en'          => $dto->titleEn,
            'title_mm'          => $dto->titleMm,
            'subtitle_en'       => $dto->subtitleEn,
            'subtitle_mm'       => $dto->subtitleMm,
            'tag_en'            => $dto->tagEn,
            'tag_mm'            => $dto->tagMm,
            'accent_color'      => $dto->accentColor,
            'icon_key'          => $dto->iconKey,
            'navigation_screen' => $dto->navigationScreen,
            'navigation_params' => $dto->navigationParams,
            'is_active'         => $dto->isActive,
            'is_coming_soon'    => $dto->isComingSoon,
        ]);
    }

    public function update(HomeCard $card, HomeCardDTO $dto): HomeCard
    {
        $card->update([
            'slug'              => $dto->slug,
            'title_en'          => $dto->titleEn,
            'title_mm'          => $dto->titleMm,
            'subtitle_en'       => $dto->subtitleEn,
            'subtitle_mm'       => $dto->subtitleMm,
            'tag_en'            => $dto->tagEn,
            'tag_mm'            => $dto->tagMm,
            'accent_color'      => $dto->accentColor,
            'icon_key'          => $dto->iconKey,
            'navigation_screen' => $dto->navigationScreen,
            'navigation_params' => $dto->navigationParams,
            'is_active'         => $dto->isActive,
            'is_coming_soon'    => $dto->isComingSoon,
        ]);

        return $card->fresh();
    }

    public function destroy(HomeCard $card): void
    {
        $card->delete();
    }

    public function restore(HomeCard $card): HomeCard
    {
        $card->restore();
        return $card->fresh();
    }

    /**
     * Rewrite positions as a clean 1…N sequence from the given ordered ID array.
     * Wrapped in a transaction with row locks to prevent concurrent drift.
     */
    public function reorder(array $orderedIds): void
    {
        DB::transaction(function () use ($orderedIds): void {
            HomeCard::whereIn('id', $orderedIds)->lockForUpdate()->get();

            foreach ($orderedIds as $index => $id) {
                HomeCard::where('id', $id)->update(['position' => $index + 1]);
            }
        });
    }
}
