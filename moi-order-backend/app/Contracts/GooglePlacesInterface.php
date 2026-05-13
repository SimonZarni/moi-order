<?php

declare(strict_types=1);

namespace App\Contracts;

interface GooglePlacesInterface
{
    /**
     * @return list<array{place_id: string, name: string, address: string}>
     */
    public function autocomplete(string $query, ?float $lat, ?float $lng): array;

    /**
     * @return array{lat: float, lng: float}|null
     */
    public function placeLocation(string $placeId): array|null;
}
