<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\StoreHomeCardIconDTO;
use App\Enums\HomeCardIconType;
use App\Models\HomeCardIcon;
use App\Support\CacheKeys;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class HomeCardIconService
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    public function index(): Collection
    {
        // TTL matches signed URL expiry (30 min) with a 5-min safety margin
        return Cache::remember(CacheKeys::HOME_CARD_ICONS_ACTIVE, now()->addMinutes(25), function (): Collection {
            return HomeCardIcon::active()->orderBy('label')->get()
                ->each(function (HomeCardIcon $icon): void {
                    if ($icon->type === HomeCardIconType::Custom && $icon->image_path) {
                        $icon->image_url = $this->storage->publicUrl($icon->image_path);
                    }
                });
        });
    }

    public function delete(HomeCardIcon $icon): void
    {
        if ($icon->type !== HomeCardIconType::Custom) {
            throw new \DomainException('icon.not_deletable');
        }

        $icon->delete();

        Cache::forget(CacheKeys::HOME_CARD_ICONS_ACTIVE);
    }

    public function store(StoreHomeCardIconDTO $dto): HomeCardIcon
    {
        $path = $this->storage->store($dto->image, 'home-card-icons', [
            'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
            'image/gif', 'image/bmp', 'image/tiff', 'image/heic', 'image/heif',
            'image/avif', 'image/x-icon', 'image/vnd.microsoft.icon',
        ]);

        $icon = HomeCardIcon::create([
            'key'        => $dto->key,
            'label'      => $dto->label,
            'type'       => HomeCardIconType::Custom,
            'image_path' => $path,
            'is_active'  => true,
        ]);

        $icon->image_url = $this->storage->publicUrl($icon->image_path);

        Cache::forget(CacheKeys::HOME_CARD_ICONS_ACTIVE);

        return $icon;
    }
}
