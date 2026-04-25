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
        $search = $request->string('search')->trim()->value();

        // coverImage: loads 1 row per place (HasOne, lowest sort_order).
        // Previously `images` loaded every image for every place — ~5× the data.
        $places = Place::with(['category', 'coverImage'])
            ->when($search !== '', function ($q) use ($search): void {
                $q->where(function ($q) use ($search): void {
                    $q->where('name_en', 'like', "%{$search}%")
                        ->orWhere('name_my', 'like', "%{$search}%")
                        ->orWhere('name_th', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                });
                // Tier 1: name_en starts with term (strongest signal).
                // Tier 2: name_en contains term mid-string.
                // Tier 3: name_th or name_my starts with term.
                // Tier 4: any other field matches (city, mid-string other langs).
                // created_at DESC breaks ties within each tier.
                $q->orderByRaw(
                    'CASE
                        WHEN name_en LIKE ? THEN 1
                        WHEN name_en LIKE ? THEN 2
                        WHEN name_th LIKE ? OR name_my LIKE ? THEN 3
                        ELSE 4
                    END',
                    ["{$search}%", "%{$search}%", "{$search}%", "{$search}%"],
                );
            })
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
