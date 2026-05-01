<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\StoreHomeCardIconDTO;
use App\Enums\HomeCardIconType;
use App\Models\HomeCardIcon;
use Illuminate\Support\Collection;

class HomeCardIconService
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    public function index(): Collection
    {
        return HomeCardIcon::active()->orderBy('label')->get()
            ->each(function (HomeCardIcon $icon): void {
                if ($icon->type === HomeCardIconType::Custom && $icon->image_path) {
                    $icon->image_url = $this->storage->publicUrl($icon->image_path);
                }
            });
    }

    public function store(StoreHomeCardIconDTO $dto): HomeCardIcon
    {
        $path = $this->storage->store($dto->image, 'home-card-icons', ['image/png', 'image/jpeg']);

        $icon = HomeCardIcon::create([
            'key'        => $dto->key,
            'label'      => $dto->label,
            'type'       => HomeCardIconType::Custom,
            'image_path' => $path,
            'is_active'  => true,
        ]);

        $icon->image_url = $this->storage->publicUrl($icon->image_path);

        return $icon;
    }
}
