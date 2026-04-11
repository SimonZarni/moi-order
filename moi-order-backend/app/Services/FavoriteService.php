<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\FavoritePlace;
use App\Models\Place;

/**
 * Principle: SRP — owns the favorite toggle / check logic only.
 * Principle: Encapsulation — callers never touch FavoritePlace directly.
 * Principle: Tell-Don't-Ask — toggle() returns the new state, not raw data.
 *
 * DB safety: the unique(user_id, place_id) index prevents duplicate rows even
 * under concurrent requests — the constraint acts as the final guard.
 */
class FavoriteService
{
    /**
     * Toggle a place in the user's favorites.
     *
     * Returns true  when the place is now favorited.
     * Returns false when the place was removed from favorites.
     */
    public function toggle(int $userId, int $placeId): bool
    {
        // Validates the place exists (ModelNotFoundException → 404 via Handler).
        // SoftDeletes trait ensures deleted places are excluded automatically.
        Place::findOrFail($placeId);

        $existing = FavoritePlace::where('user_id', $userId)
            ->where('place_id', $placeId)
            ->first();

        if ($existing !== null) {
            $existing->delete();

            return false;
        }

        FavoritePlace::create([
            'user_id'    => $userId,
            'place_id'   => $placeId,
            'created_at' => now(),
        ]);

        return true;
    }

    /**
     * Check whether a user has favorited a place.
     */
    public function isFavorited(int $userId, int $placeId): bool
    {
        return FavoritePlace::where('user_id', $userId)
            ->where('place_id', $placeId)
            ->exists();
    }
}
