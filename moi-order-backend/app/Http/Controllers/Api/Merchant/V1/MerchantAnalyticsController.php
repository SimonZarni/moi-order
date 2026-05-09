<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Enums\FoodOrderStatus;
use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only; SQL aggregates delegated to private helper.
 * Principle: Security — all queries scoped to the authenticated merchant's restaurant.
 */
class MerchantAnalyticsController extends Controller
{
    /** GET /api/merchant/v1/analytics */
    public function index(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();

        if ($restaurant === null) {
            $zero = ['order_count' => 0, 'revenue_cents' => 0];
            return response()->json(['data' => [
                'today' => $zero, 'this_week' => $zero, 'this_month' => $zero, 'pending_count' => 0,
            ]]);
        }

        $rid      = $restaurant->id;
        $excluded = [FoodOrderStatus::Cancelled->value];

        return response()->json([
            'data' => [
                'today'         => $this->periodStats($rid, now()->startOfDay(), $excluded),
                'this_week'     => $this->periodStats($rid, now()->startOfWeek(), $excluded),
                'this_month'    => $this->periodStats($rid, now()->startOfMonth(), $excluded),
                'pending_count' => FoodOrder::forRestaurant($rid)
                    ->whereIn('status', [
                        FoodOrderStatus::OrderPlaced->value,
                        FoodOrderStatus::WaitingForPayment->value,
                        FoodOrderStatus::PaymentConfirmed->value,
                        FoodOrderStatus::PreparingFood->value,
                        FoodOrderStatus::WaitingForDelivery->value,
                    ])
                    ->count(),
            ],
        ]);
    }

    /** @param string[] $excluded */
    private function periodStats(int $restaurantId, Carbon $from, array $excluded): array
    {
        $row = FoodOrder::forRestaurant($restaurantId)
            ->whereNotIn('status', $excluded)
            ->where('created_at', '>=', $from)
            ->selectRaw('COUNT(*) as order_count, COALESCE(SUM(total_cents), 0) as revenue_cents')
            ->first();

        return [
            'order_count'   => (int) ($row?->order_count ?? 0),
            'revenue_cents' => (int) ($row?->revenue_cents ?? 0),
        ];
    }
}
