<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only; reads rated orders for the authenticated merchant's restaurant.
 */
class MerchantReviewController extends Controller
{
    /** GET /api/merchant/v1/reviews */
    public function index(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();

        if ($restaurant === null) {
            return response()->json(['data' => [], 'meta' => [
                'current_page' => 1,
                'last_page'    => 1,
                'per_page'     => 20,
                'total'        => 0,
            ]]);
        }

        $query = FoodOrder::with(['user'])
            ->where('restaurant_id', $restaurant->id)
            ->whereNotNull('rating')
            ->orderByDesc('completed_at');

        if ($request->filled('rating')) {
            $query->where('rating', $request->integer('rating'));
        }

        $orders = $query->paginate($request->integer('per_page', 20));

        return response()->json([
            'data' => collect($orders->items())->map(fn (FoodOrder $o) => [
                'id'              => $o->uuid,
                'order_number'    => $o->order_number,
                'rating'          => $o->rating,
                'customer_review' => $o->customer_review,
                'user'            => ['id' => $o->user->id, 'name' => $o->user->name],
                'completed_at'    => $o->completed_at?->toIso8601String(),
            ]),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
            ],
        ]);
    }
}
