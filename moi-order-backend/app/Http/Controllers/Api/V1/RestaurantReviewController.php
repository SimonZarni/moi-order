<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\FoodOrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\RestaurantReviewResource;
use App\Models\FoodOrder;
use App\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — public read-only access to restaurant reviews.
 * Security: no PII exposed; only display name (never email, phone, user id).
 * Principle: OCP — adding new review types (photos etc.) is a new Resource, not a change here.
 */
class RestaurantReviewController extends Controller
{
    /** GET /api/v1/restaurants/{id}/reviews — intentionally public */
    public function index(Request $request, int $id): JsonResponse
    {
        $restaurant = Restaurant::findOrFail($id);

        $perPage = min((int) ($request->query('per_page', 20) ?: 20), 100);

        $reviews = FoodOrder::forRestaurant($restaurant->id)
            ->where('status', FoodOrderStatus::Completed->value)
            ->whereNotNull('rating')
            ->with('user')
            ->latest()
            ->paginate($perPage);

        $averageRating = FoodOrder::forRestaurant($restaurant->id)
            ->where('status', FoodOrderStatus::Completed->value)
            ->whereNotNull('rating')
            ->avg('rating');

        return response()->json([
            'data' => $reviews->map(fn ($o) => (new RestaurantReviewResource($o))->toArray($request))->values(),
            'meta' => [
                'current_page'   => $reviews->currentPage(),
                'last_page'      => $reviews->lastPage(),
                'per_page'       => $reviews->perPage(),
                'total'          => $reviews->total(),
                'average_rating' => $averageRating !== null ? round((float) $averageRating, 1) : null,
            ],
        ]);
    }
}
