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

    /**
     * Search for places by text query, biased toward the given coordinates.
     * Returns the top 3 matches from Google Places New API.
     *
     * @return list<array{id: string, displayName: string, formattedAddress: string}>
     */
    public function searchText(string $query, float $lat, float $lng): array;

    /**
     * Fetch up to $maxPhotos photo records for the given Google Place ID.
     * Calls GET places/{id} for photo names, then resolves each photo URI via the media endpoint.
     *
     * @return list<array{name: string, photoUri: string, widthPx: int|null, heightPx: int|null, authorName: string|null}>
     */
    public function fetchPlacePhotos(string $googlePlaceId, int $maxPhotos = 10): array;
}
