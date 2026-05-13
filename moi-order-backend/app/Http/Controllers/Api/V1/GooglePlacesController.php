<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\GooglePlacesInterface;
use App\Http\Requests\Api\V1\GooglePlacesSearchRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GooglePlacesController
{
    public function __construct(private readonly GooglePlacesInterface $places) {}

    public function search(GooglePlacesSearchRequest $request): JsonResponse
    {
        $lat = $request->has('lat') ? (float) $request->input('lat') : null;
        $lng = $request->has('lng') ? (float) $request->input('lng') : null;

        $results = $this->places->autocomplete(
            $request->string('q')->toString(),
            $lat,
            $lng,
        );

        return response()->json(['data' => $results]);
    }

    public function location(Request $request, string $placeId): JsonResponse
    {
        if (! preg_match('/^[A-Za-z0-9_\-]{5,255}$/', $placeId)) {
            return response()->json([
                'message' => 'Invalid place ID.',
                'code'    => 'invalid_place_id',
            ], 422);
        }

        $location = $this->places->placeLocation($placeId);

        if ($location === null) {
            return response()->json([
                'message' => 'Location not found.',
                'code'    => 'not_found',
            ], 404);
        }

        return response()->json(['data' => $location]);
    }
}
