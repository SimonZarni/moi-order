<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\GooglePlacesInterface;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GooglePlacesService implements GooglePlacesInterface
{
    private const AUTOCOMPLETE_URL  = 'https://places.googleapis.com/v1/places:autocomplete';
    private const PLACE_DETAILS_URL = 'https://places.googleapis.com/v1/places/';
    private const SEARCH_TEXT_URL   = 'https://places.googleapis.com/v1/places:searchText';
    private const PHOTO_MEDIA_BASE  = 'https://places.googleapis.com/v1/';

    public function __construct(private readonly string $apiKey) {}

    public function autocomplete(string $query, ?float $lat, ?float $lng): array
    {
        $body = ['input' => $query, 'languageCode' => 'en'];

        if ($lat !== null && $lng !== null) {
            $body['locationBias'] = [
                'circle' => [
                    'center' => ['latitude' => $lat, 'longitude' => $lng],
                    'radius' => 50000.0,
                ],
            ];
        }

        try {
            $response = Http::withHeaders([
                'X-Goog-Api-Key' => $this->apiKey,
                'Content-Type'   => 'application/json',
            ])->post(self::AUTOCOMPLETE_URL, $body);

            if (! $response->successful()) {
                Log::warning('Google Places autocomplete failed', [
                    'status' => $response->status(),
                    'query'  => $query,
                ]);
                return [];
            }
        } catch (ConnectionException $e) {
            Log::error('Google Places autocomplete connection error', ['error' => $e->getMessage()]);
            return [];
        }

        $suggestions = $response->json('suggestions', []);

        return array_values(array_filter(array_map(function (array $s): array|null {
            $prediction = $s['placePrediction'] ?? null;
            if (! $prediction) return null;

            $placeId = $prediction['placeId'] ?? '';
            if (! $placeId) return null;

            return [
                'place_id' => $placeId,
                'name'     => $prediction['structuredFormat']['mainText']['text']
                              ?? $prediction['text']['text']
                              ?? '',
                'address'  => $prediction['structuredFormat']['secondaryText']['text'] ?? '',
            ];
        }, $suggestions)));
    }

    public function placeLocation(string $placeId): array|null
    {
        $url = self::PLACE_DETAILS_URL . rawurlencode($placeId);

        try {
            $response = Http::withHeaders([
                'X-Goog-Api-Key'   => $this->apiKey,
                'X-Goog-FieldMask' => 'location',
            ])->get($url);

            if (! $response->successful()) {
                Log::warning('Google Places location lookup failed', [
                    'status'  => $response->status(),
                    'placeId' => $placeId,
                ]);
                return null;
            }
        } catch (ConnectionException $e) {
            Log::error('Google Places location connection error', ['error' => $e->getMessage()]);
            return null;
        }

        $location = $response->json('location');

        if (! is_array($location) || ! isset($location['latitude'], $location['longitude'])) {
            return null;
        }

        return [
            'lat' => (float) $location['latitude'],
            'lng' => (float) $location['longitude'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function searchText(string $query, float $lat, float $lng): array
    {
        try {
            $response = Http::withHeaders([
                'X-Goog-Api-Key'   => $this->apiKey,
                'X-Goog-FieldMask' => 'places.id,places.displayName,places.formattedAddress',
                'Content-Type'     => 'application/json',
            ])->post(self::SEARCH_TEXT_URL, [
                'textQuery'    => $query,
                'languageCode' => 'en',
                'maxResultCount' => 3,
                'locationBias' => [
                    'circle' => [
                        'center' => ['latitude' => $lat, 'longitude' => $lng],
                        'radius' => 500.0,
                    ],
                ],
            ]);
        } catch (ConnectionException $e) {
            Log::error('Google Places searchText connection error', ['error' => $e->getMessage()]);
            return [];
        }

        if (! $response->successful()) {
            Log::warning('Google Places searchText failed', [
                'status' => $response->status(),
                'query'  => $query,
            ]);
            return [];
        }

        $places = $response->json('places', []);

        return array_values(array_map(fn (array $p): array => [
            'id'               => $p['id'] ?? '',
            'displayName'      => $p['displayName']['text'] ?? '',
            'formattedAddress' => $p['formattedAddress'] ?? '',
        ], array_filter($places, fn (array $p): bool => ! empty($p['id']))));
    }

    /**
     * {@inheritdoc}
     *
     * Two-step: (1) GET place details for photo names, (2) resolve each photo's media URI.
     * A 100ms sleep between media calls avoids hitting Google's burst rate limit.
     */
    public function fetchPlacePhotos(string $googlePlaceId, int $maxPhotos = 10): array
    {
        // Step 1 — get photo metadata (names + dimensions + attribution)
        $detailUrl = self::PLACE_DETAILS_URL . rawurlencode($googlePlaceId);

        try {
            $detailResponse = Http::withHeaders([
                'X-Goog-Api-Key'   => $this->apiKey,
                'X-Goog-FieldMask' => 'photos',
            ])->get($detailUrl);
        } catch (ConnectionException $e) {
            Log::error('Google Places fetchPlacePhotos detail error', [
                'placeId' => $googlePlaceId,
                'error'   => $e->getMessage(),
            ]);
            return [];
        }

        if (! $detailResponse->successful()) {
            Log::warning('Google Places fetchPlacePhotos detail failed', [
                'status'  => $detailResponse->status(),
                'placeId' => $googlePlaceId,
            ]);
            return [];
        }

        $photoMeta = array_slice($detailResponse->json('photos', []), 0, $maxPhotos);

        if (empty($photoMeta)) {
            return [];
        }

        // Step 2 — resolve each photo's media URI
        $results = [];

        foreach ($photoMeta as $meta) {
            $name = $meta['name'] ?? '';
            if (! $name) continue;

            try {
                $mediaResponse = Http::withHeaders([
                    'X-Goog-Api-Key' => $this->apiKey,
                ])->get(self::PHOTO_MEDIA_BASE . $name . '/media', [
                    'maxWidthPx'       => 1600,
                    'skipHttpRedirect' => 'true',
                ]);
            } catch (ConnectionException $e) {
                Log::warning('Google Places photo media fetch failed', [
                    'name'  => $name,
                    'error' => $e->getMessage(),
                ]);
                usleep(100_000);
                continue;
            }

            if (! $mediaResponse->successful()) {
                usleep(100_000);
                continue;
            }

            $photoUri = $mediaResponse->json('photoUri');
            if (! $photoUri) {
                usleep(100_000);
                continue;
            }

            $results[] = [
                'name'       => $name,
                'photoUri'   => $photoUri,
                'widthPx'    => isset($meta['widthPx'])  ? (int) $meta['widthPx']  : null,
                'heightPx'   => isset($meta['heightPx']) ? (int) $meta['heightPx'] : null,
                'authorName' => $meta['authorAttributions'][0]['displayName'] ?? null,
            ];

            usleep(100_000); // 100ms between requests
        }

        return $results;
    }
}
