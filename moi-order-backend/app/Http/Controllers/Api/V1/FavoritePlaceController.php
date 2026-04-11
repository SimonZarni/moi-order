<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Services\FavoriteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only; all logic delegated to FavoriteService.
 * Principle: DIP — depends on FavoriteService via constructor injection.
 * Security: routes are inside the auth:sanctum group — no inline auth check needed.
 */
class FavoritePlaceController
{
    public function __construct(private readonly FavoriteService $favoriteService) {}

    /**
     * GET /api/v1/places/{placeId}/favorite
     * Returns whether the authenticated user has favorited the place.
     */
    public function show(Request $request, int $placeId): JsonResponse
    {
        $isFavorited = $this->favoriteService->isFavorited(
            $request->user()->id,
            $placeId,
        );

        return response()->json(['data' => ['is_favorited' => $isFavorited]]);
    }

    /**
     * POST /api/v1/places/{placeId}/favorite
     * Toggles the favorite state and returns the new state.
     */
    public function toggle(Request $request, int $placeId): JsonResponse
    {
        $isFavorited = $this->favoriteService->toggle(
            $request->user()->id,
            $placeId,
        );

        return response()->json(['data' => ['is_favorited' => $isFavorited]]);
    }
}
