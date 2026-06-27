<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\StoreHomeCardRouteDTO;
use App\Models\HomeCardRoute;
use Illuminate\Support\Collection;

class HomeCardRouteService
{
    public function index(): Collection
    {
        return HomeCardRoute::active()->orderBy('label_en')->get();
    }

    public function store(StoreHomeCardRouteDTO $dto): HomeCardRoute
    {
        return HomeCardRoute::create([
            'key'       => $dto->key,
            'label_en'  => $dto->labelEn,
            'label_mm'  => $dto->labelMm,
            'type'      => $dto->type,
            'url'       => $dto->url,
            'is_active' => true,
        ]);
    }

    public function destroy(HomeCardRoute $route): void
    {
        $route->delete();
    }
}
