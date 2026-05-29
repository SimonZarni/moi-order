<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Enums\FoodOrderStatus;
use App\Http\Controllers\Controller;
use App\Models\FoodOrder;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — HTTP layer only; SQL aggregates delegated to private helpers.
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

    /**
     * GET /api/merchant/v1/analytics/chart?period=today|week|month
     *
     * Returns time-series data for the chart: hourly (today) or daily (week/month).
     * Each point: { label, revenue_cents, order_count }.
     */
    public function chart(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();

        if ($restaurant === null) {
            return response()->json(['data' => ['period' => 'today', 'points' => []]]);
        }

        $period   = in_array($request->query('period'), ['today', 'week', 'month'], true)
            ? $request->query('period')
            : 'today';
        $rid      = $restaurant->id;
        $excluded = [FoodOrderStatus::Cancelled->value];

        $points = match ($period) {
            'week'  => $this->weeklyPoints($rid, $excluded),
            'month' => $this->monthlyPoints($rid, $excluded),
            default => $this->hourlyPoints($rid, $excluded),
        };

        return response()->json(['data' => ['period' => $period, 'points' => $points]]);
    }

    /**
     * GET /api/merchant/v1/analytics/tops?period=today|week|month
     *
     * Returns top 5 selling items and top 5 customers for the given period,
     * all scoped to the authenticated merchant's restaurant.
     */
    public function tops(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();

        if ($restaurant === null) {
            return response()->json(['data' => ['top_items' => [], 'top_customers' => []]]);
        }

        $period   = $request->query('period', 'today');
        $from     = match ($period) {
            'week'  => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            default => now()->startOfDay(),
        };
        $rid      = $restaurant->id;
        $excluded = [FoodOrderStatus::Cancelled->value];

        // Top items — grouped by snapshot name, ranked by total quantity sold
        $topItems = DB::table('food_order_items')
            ->join('food_orders', 'food_orders.id', '=', 'food_order_items.food_order_id')
            ->where('food_orders.restaurant_id', $rid)
            ->whereNotIn('food_orders.status', $excluded)
            ->where('food_orders.created_at', '>=', $from)
            ->groupBy('food_order_items.name')
            ->selectRaw('food_order_items.name,
                         CAST(SUM(food_order_items.quantity)      AS UNSIGNED) AS total_quantity,
                         CAST(SUM(food_order_items.subtotal_cents) AS UNSIGNED) AS revenue_cents')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        // Top customers — ranked by total spend in the period
        $topCustomers = DB::table('food_orders')
            ->join('users', 'users.id', '=', 'food_orders.user_id')
            ->where('food_orders.restaurant_id', $rid)
            ->whereNotIn('food_orders.status', $excluded)
            ->where('food_orders.created_at', '>=', $from)
            ->groupBy('food_orders.user_id', 'users.name')
            ->selectRaw('users.name,
                         CAST(COUNT(*)                          AS UNSIGNED) AS order_count,
                         CAST(SUM(food_orders.total_cents)     AS UNSIGNED) AS total_cents')
            ->orderByDesc('total_cents')
            ->limit(5)
            ->get();

        return response()->json([
            'data' => [
                'top_items'     => $topItems,
                'top_customers' => $topCustomers,
            ],
        ]);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /** Hourly breakdown for today (24 points, hour 0–23). */
    /** @param string[] $excluded */
    private function hourlyPoints(int $restaurantId, array $excluded): array
    {
        $date = now()->format('Y-m-d');

        $rows = FoodOrder::forRestaurant($restaurantId)
            ->whereNotIn('status', $excluded)
            ->whereDate('created_at', $date)
            ->selectRaw('HOUR(created_at) AS hr,
                         COUNT(*) AS order_count,
                         COALESCE(SUM(total_cents), 0) AS revenue_cents')
            ->groupBy('hr')
            ->get()
            ->keyBy('hr');

        return collect(range(0, 23))->map(function (int $hour) use ($rows): array {
            $row = $rows->get($hour);
            return [
                'label'         => sprintf('%02d:00', $hour),
                'revenue_cents' => (int) ($row?->revenue_cents ?? 0),
                'order_count'   => (int) ($row?->order_count   ?? 0),
            ];
        })->values()->all();
    }

    /** Daily breakdown for the last 7 days (7 points). */
    /** @param string[] $excluded */
    private function weeklyPoints(int $restaurantId, array $excluded): array
    {
        $from = now()->subDays(6)->startOfDay();

        $rows = FoodOrder::forRestaurant($restaurantId)
            ->whereNotIn('status', $excluded)
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) AS day,
                         COUNT(*) AS order_count,
                         COALESCE(SUM(total_cents), 0) AS revenue_cents')
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        return collect(range(0, 6))->map(function (int $i) use ($rows, $from): array {
            $day = $from->copy()->addDays($i);
            $key = $day->format('Y-m-d');
            $row = $rows->get($key);
            return [
                'label'         => $day->format('D'),   // Mon, Tue, …
                'revenue_cents' => (int) ($row?->revenue_cents ?? 0),
                'order_count'   => (int) ($row?->order_count   ?? 0),
            ];
        })->values()->all();
    }

    /** Daily breakdown for the last 30 days (30 points). */
    /** @param string[] $excluded */
    private function monthlyPoints(int $restaurantId, array $excluded): array
    {
        $from = now()->subDays(29)->startOfDay();

        $rows = FoodOrder::forRestaurant($restaurantId)
            ->whereNotIn('status', $excluded)
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) AS day,
                         COUNT(*) AS order_count,
                         COALESCE(SUM(total_cents), 0) AS revenue_cents')
            ->groupBy('day')
            ->get()
            ->keyBy('day');

        return collect(range(0, 29))->map(function (int $i) use ($rows, $from): array {
            $day = $from->copy()->addDays($i);
            $key = $day->format('Y-m-d');
            $row = $rows->get($key);
            return [
                'label'         => $day->format('j M'),  // 1 May, 2 May, …
                'revenue_cents' => (int) ($row?->revenue_cents ?? 0),
                'order_count'   => (int) ($row?->order_count   ?? 0),
            ];
        })->values()->all();
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
