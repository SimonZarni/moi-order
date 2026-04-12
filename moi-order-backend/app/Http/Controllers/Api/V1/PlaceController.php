<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlaceResource;
use App\Models\Place;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — no auth required (public endpoints); queries never expose deleted records.
 */
class PlaceController extends Controller
{
    /**
     * GET /api/v1/places
     * Paginated list with category and cover image.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // coverImage: loads 1 row per place (HasOne, lowest sort_order).
        // Previously `images` loaded every image for every place — ~5× the data.
        $places = Place::with(['category', 'coverImage'])
            ->latest()
            ->paginate(perPage: 20);

        return PlaceResource::collection($places);
    }

    /**
     * GET /api/v1/places/{place}
     * Full detail with category, all images, and tags.
     */
    public function show(Place $place): JsonResponse
    {
        $place->load(['category', 'images', 'tags']);

        return response()->json([
            'data' => new PlaceResource($place),
        ]);
    }
}
