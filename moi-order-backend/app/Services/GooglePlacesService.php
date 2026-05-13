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
}
