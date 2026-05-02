<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\StoreHomeCardRouteDTO;
use App\Models\HomeCardRoute;
use App\Support\CacheKeys;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class HomeCardRouteService
{
    public function index(): Collection
    {
        return Cache::remember(CacheKeys::HOME_CARD_ROUTES_ACTIVE, now()->addDays(7), fn (): Collection =>
            HomeCardRoute::active()->orderBy('label_en')->get()
        );
    }

    public function store(StoreHomeCardRouteDTO $dto): HomeCardRoute
    {
        $route = HomeCardRoute::create([
            'key'       => $dto->key,
            'label_en'  => $dto->labelEn,
            'label_mm'  => $dto->labelMm,
            'type'      => $dto->type,
            'url'       => $dto->url,
            'is_active' => true,
        ]);

        Cache::forget(CacheKeys::HOME_CARD_ROUTES_ACTIVE);

        return $route;
    }
}
