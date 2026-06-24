<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\ReplyToReviewRequest;
use App\Models\FoodOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only; reads rated orders for the authenticated merchant's restaurant.
 */
class MerchantReviewController extends Controller
{
    /**
     * POST /api/merchant/v1/reviews/{orderId}/reply
     * Add or update the merchant's reply to a customer review.
     * Principle: Security — order scoped to the merchant's own restaurant.
     */
    public function reply(ReplyToReviewRequest $request, string $orderId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();

        if ($restaurant === null) {
            return response()->json(['message' => 'Restaurant not found.', 'code' => 'not_found'], 404);
        }

        /** @var FoodOrder|null $order */
        $order = FoodOrder::where('uuid', $orderId)
            ->where('restaurant_id', $restaurant->id)
            ->whereNotNull('rating')
            ->first();

        if ($order === null) {
            return response()->json(['message' => 'Review not found.', 'code' => 'not_found'], 404);
        }

        $order->update([
            'merchant_reply'      => $request->validated('reply'),
            'merchant_replied_at' => now(),
        ]);

        return response()->json([
            'data' => [
                'merchant_reply'      => $order->fresh()->merchant_reply,
                'merchant_replied_at' => $order->fresh()->merchant_replied_at?->toIso8601String(),
            ],
        ]);
    }

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
                'id'                  => $o->uuid,
                'order_number'        => $o->order_number,
                'rating'              => $o->rating,
                'customer_review'     => $o->customer_review,
                'merchant_reply'      => $o->merchant_reply,
                'merchant_replied_at' => $o->merchant_replied_at?->toIso8601String(),
                'user'                => ['id' => $o->user->id, 'name' => $o->user->name],
                'completed_at'        => $o->completed_at?->toIso8601String(),
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
