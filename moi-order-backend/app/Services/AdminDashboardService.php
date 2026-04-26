<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Enums\SubmissionStatus;
use App\Models\Payment;
use App\Models\Place;
use App\Models\ServiceSubmission;
use App\Models\TicketOrder;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Collection;

/**
 * Principle: SRP — computes all admin dashboard aggregate data; no HTTP concerns.
 * Principle: DIP — receives no infrastructure dependencies directly; uses Eloquent models.
 */
class AdminDashboardService
{
    public function get(): array
    {
        $now = Carbon::now();

        return [
            'summary'                     => $this->buildSummary($now),
            'monthly_orders'              => $this->buildMonthlyOrders($now),
            'orders_by_service'           => $this->buildOrdersByService(),
            'top_services_comparison'     => $this->buildTopServicesComparison($now),
            'submission_status_breakdown' => $this->buildStatusBreakdown($now),
            'recent_activity'             => $this->buildRecentActivity(),
            'payment_timeline'            => $this->buildPaymentTimeline(),
            'pending_submissions_count'   => ServiceSubmission::where('status', SubmissionStatus::Processing)->count(),
        ];
    }

    // ─── Summary (4 KPI cards + sparklines) ──────────────────────────────────

    private function buildSummary(Carbon $now): array
    {
        $currentYear    = $now->year;
        $lastYear       = $currentYear - 1;
        $eightMonthsAgo = $now->copy()->subMonths(7)->startOfMonth();

        // Batch: submissions + ticket orders by month (last 8 months)
        $subsByMonth    = $this->monthlyCountIndex(ServiceSubmission::class, $eightMonthsAgo, $now);
        $ticketsByMonth = $this->monthlyCountIndex(TicketOrder::class, $eightMonthsAgo, $now);
        $usersByMonth   = User::selectRaw('YEAR(created_at) as yr, MONTH(created_at) as mo, COUNT(*) as cnt')
            ->where('created_at', '>=', $eightMonthsAgo)
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()->keyBy(fn ($r) => "{$r->yr}-{$r->mo}");
        $placesByMonth  = Place::selectRaw('YEAR(created_at) as yr, MONTH(created_at) as mo, COUNT(*) as cnt')
            ->where('created_at', '>=', $eightMonthsAgo)
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()->keyBy(fn ($r) => "{$r->yr}-{$r->mo}");
        $revenueByMonth = Payment::selectRaw('YEAR(created_at) as yr, MONTH(created_at) as mo, SUM(amount) as total')
            ->where('status', PaymentStatus::Succeeded)
            ->where('created_at', '>=', $eightMonthsAgo)
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()->keyBy(fn ($r) => "{$r->yr}-{$r->mo}");

        // Year totals
        $submissionsThisYear  = ServiceSubmission::whereYear('created_at', $currentYear)->count();
        $submissionsLastYear  = ServiceSubmission::whereYear('created_at', $lastYear)->count();
        $ticketOrdersThisYear = TicketOrder::whereYear('created_at', $currentYear)->count();
        $ticketOrdersLastYear = TicketOrder::whereYear('created_at', $lastYear)->count();
        $totalOrdersThis      = $submissionsThisYear + $ticketOrdersThisYear;
        $totalOrdersLast      = $submissionsLastYear + $ticketOrdersLastYear;

        $activeUsers       = User::where('status', 'active')->count();
        $newUsersThisYear  = User::whereYear('created_at', $currentYear)->count();
        $newUsersLastYear  = User::whereYear('created_at', $lastYear)->count();

        $listedPlaces      = Place::count();
        $newPlacesThisYear = Place::whereYear('created_at', $currentYear)->count();
        $newPlacesLastYear = Place::whereYear('created_at', $lastYear)->count();

        $revenueThisYear = (int) Payment::where('status', PaymentStatus::Succeeded)
            ->whereYear('created_at', $currentYear)->sum('amount');
        $revenueLastYear = (int) Payment::where('status', PaymentStatus::Succeeded)
            ->whereYear('created_at', $lastYear)->sum('amount');

        // 8-month sparklines
        $months = collect(range(7, 0))->map(fn (int $i) => $now->copy()->subMonths($i));

        $ordersMonthly = $months->map(function (Carbon $m) use ($subsByMonth, $ticketsByMonth): int {
            $key = "{$m->year}-{$m->month}";
            return (int) ($subsByMonth[$key]?->cnt ?? 0) + (int) ($ticketsByMonth[$key]?->cnt ?? 0);
        });

        $usersMonthly = $months->map(fn (Carbon $m): int =>
            (int) ($usersByMonth["{$m->year}-{$m->month}"]?->cnt ?? 0)
        );

        $placesMonthly = $months->map(fn (Carbon $m): int =>
            (int) ($placesByMonth["{$m->year}-{$m->month}"]?->cnt ?? 0)
        );

        $revenueMonthly = $months->map(fn (Carbon $m): int =>
            (int) ($revenueByMonth["{$m->year}-{$m->month}"]?->total ?? 0)
        );

        return [
            'total_orders'          => $totalOrdersThis,
            'total_orders_change'   => $this->pctChange($totalOrdersLast, $totalOrdersThis),
            'total_orders_monthly'  => $ordersMonthly->values()->toArray(),
            'active_users'          => $activeUsers,
            'active_users_change'   => $this->pctChange($newUsersLastYear, $newUsersThisYear),
            'active_users_monthly'  => $usersMonthly->values()->toArray(),
            'listed_places'         => $listedPlaces,
            'listed_places_change'  => $this->pctChange($newPlacesLastYear, $newPlacesThisYear),
            'listed_places_monthly' => $placesMonthly->values()->toArray(),
            'total_revenue'         => $revenueThisYear,
            'revenue_change'        => $this->pctChange($revenueLastYear, $revenueThisYear),
            'revenue_monthly'       => $revenueMonthly->values()->toArray(),
        ];
    }

    // ─── Monthly orders bar chart (this year vs last year) ────────────────────

    private function buildMonthlyOrders(Carbon $now): array
    {
        $currentYear  = $now->year;
        $lastYear     = $currentYear - 1;
        $currentMonth = $now->month;
        $allMonths    = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $labels       = array_slice($allMonths, 0, $currentMonth);

        $subsByYearMonth = ServiceSubmission::selectRaw('YEAR(created_at) as yr, MONTH(created_at) as mo, COUNT(*) as cnt')
            ->whereYear('created_at', '>=', $lastYear)
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()->keyBy(fn ($r) => "{$r->yr}-{$r->mo}");

        $ticketsByYearMonth = TicketOrder::selectRaw('YEAR(created_at) as yr, MONTH(created_at) as mo, COUNT(*) as cnt')
            ->whereYear('created_at', '>=', $lastYear)
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()->keyBy(fn ($r) => "{$r->yr}-{$r->mo}");

        $thisYearData = [];
        $lastYearData = [];

        for ($m = 1; $m <= $currentMonth; $m++) {
            $thisKey = "{$currentYear}-{$m}";
            $lastKey = "{$lastYear}-{$m}";

            $thisYearData[] = (int) ($subsByYearMonth[$thisKey]?->cnt ?? 0)
                + (int) ($ticketsByYearMonth[$thisKey]?->cnt ?? 0);

            $lastYearData[] = (int) ($subsByYearMonth[$lastKey]?->cnt ?? 0)
                + (int) ($ticketsByYearMonth[$lastKey]?->cnt ?? 0);
        }

        return [
            'labels'    => $labels,
            'this_year' => $thisYearData,
            'last_year' => $lastYearData,
        ];
    }

    // ─── Orders by service (pie chart) ────────────────────────────────────────

    private function buildOrdersByService(): array
    {
        $serviceRows = ServiceSubmission::join('service_types', 'service_submissions.service_type_id', '=', 'service_types.id')
            ->join('services', 'service_types.service_id', '=', 'services.id')
            ->whereNull('service_types.deleted_at')
            ->whereNull('services.deleted_at')
            ->selectRaw('services.name as service_name, COUNT(service_submissions.id) as cnt')
            ->groupBy('services.name')
            ->get();

        $ticketCount = TicketOrder::count();

        $result = $serviceRows->map(fn ($r) => [
            'label' => $r->service_name,
            'value' => (int) $r->cnt,
        ])->values()->toArray();

        if ($ticketCount > 0) {
            $result[] = ['label' => 'Ticket Orders', 'value' => $ticketCount];
        }

        return $result;
    }

    // ─── Top services comparison (horizontal bar chart) ───────────────────────

    private function buildTopServicesComparison(Carbon $now): array
    {
        $thisMonthStart = $now->copy()->startOfMonth();
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth();
        $lastMonthEnd   = $now->copy()->subMonth()->endOfMonth();

        $topServices = ServiceSubmission::join('service_types', 'service_submissions.service_type_id', '=', 'service_types.id')
            ->join('services', 'service_types.service_id', '=', 'services.id')
            ->whereNull('service_types.deleted_at')
            ->whereNull('services.deleted_at')
            ->selectRaw('services.id as service_id, services.name as service_name, COUNT(service_submissions.id) as total_cnt')
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('total_cnt')
            ->limit(5)
            ->get();

        if ($topServices->isEmpty()) {
            return ['categories' => [], 'this_month' => [], 'last_month' => []];
        }

        $serviceIds = $topServices->pluck('service_id');

        $thisMonthCounts = ServiceSubmission::join('service_types', 'service_submissions.service_type_id', '=', 'service_types.id')
            ->whereIn('service_types.service_id', $serviceIds)
            ->whereBetween('service_submissions.created_at', [$thisMonthStart, $now])
            ->selectRaw('service_types.service_id, COUNT(*) as cnt')
            ->groupBy('service_types.service_id')
            ->get()->keyBy('service_id');

        $lastMonthCounts = ServiceSubmission::join('service_types', 'service_submissions.service_type_id', '=', 'service_types.id')
            ->whereIn('service_types.service_id', $serviceIds)
            ->whereBetween('service_submissions.created_at', [$lastMonthStart, $lastMonthEnd])
            ->selectRaw('service_types.service_id, COUNT(*) as cnt')
            ->groupBy('service_types.service_id')
            ->get()->keyBy('service_id');

        $categories = [];
        $thisMonth  = [];
        $lastMonth  = [];

        foreach ($topServices as $service) {
            $categories[] = $service->service_name;
            $thisMonth[]  = (int) ($thisMonthCounts[$service->service_id]?->cnt ?? 0);
            $lastMonth[]  = (int) ($lastMonthCounts[$service->service_id]?->cnt ?? 0);
        }

        return ['categories' => $categories, 'this_month' => $thisMonth, 'last_month' => $lastMonth];
    }

    // ─── Submission status breakdown (radar chart) ────────────────────────────

    private function buildStatusBreakdown(Carbon $now): array
    {
        $currentYear = $now->year;
        $lastYear    = $currentYear - 1;

        $statuses = [
            SubmissionStatus::Processing     => 'Processing',
            SubmissionStatus::Completed      => 'Completed',
            SubmissionStatus::PendingPayment => 'Pending Payment',
            SubmissionStatus::PaymentFailed  => 'Payment Failed',
            SubmissionStatus::Cancelled      => 'Cancelled',
        ];

        $thisYearRows = ServiceSubmission::selectRaw('status, COUNT(*) as cnt')
            ->whereYear('created_at', $currentYear)->groupBy('status')
            ->get()->keyBy('status');

        $lastYearRows = ServiceSubmission::selectRaw('status, COUNT(*) as cnt')
            ->whereYear('created_at', $lastYear)->groupBy('status')
            ->get()->keyBy('status');

        $categories     = [];
        $thisYearSeries = [];
        $lastYearSeries = [];

        foreach ($statuses as $enum => $label) {
            $categories[]     = $label;
            $thisYearSeries[] = (int) ($thisYearRows[$enum->value]?->cnt ?? 0);
            $lastYearSeries[] = (int) ($lastYearRows[$enum->value]?->cnt ?? 0);
        }

        return [
            'categories' => $categories,
            'series'     => [
                ['name' => 'This Year', 'data' => $thisYearSeries],
                ['name' => 'Last Year', 'data' => $lastYearSeries],
            ],
        ];
    }

    // ─── Recent activity feed ─────────────────────────────────────────────────

    private function buildRecentActivity(): array
    {
        $submissions = ServiceSubmission::with(['user', 'serviceType.service'])
            ->latest()->limit(5)->get()
            ->map(fn (ServiceSubmission $sub) => [
                'id'          => "ss_{$sub->id}",
                'title'       => 'Submission #' . $sub->id
                    . ($sub->serviceType?->service?->name ? ' — ' . $sub->serviceType->service->name : ''),
                'cover_url'   => '',
                'description' => $sub->status->label() . ' · ' . ($sub->user?->name ?? 'Unknown'),
                'posted_at'   => $sub->created_at->toISOString(),
            ]);

        $ticketOrders = TicketOrder::with(['user', 'ticket'])
            ->latest()->limit(5)->get()
            ->map(fn (TicketOrder $order) => [
                'id'          => "to_{$order->id}",
                'title'       => 'Ticket Order #' . $order->id
                    . ($order->ticket?->name ? ' — ' . $order->ticket->name : ''),
                'cover_url'   => '',
                'description' => $order->status->label() . ' · ' . ($order->user?->name ?? 'Unknown'),
                'posted_at'   => $order->created_at->toISOString(),
            ]);

        return $submissions->concat($ticketOrders)
            ->sortByDesc('posted_at')
            ->take(5)
            ->values()
            ->toArray();
    }

    // ─── Payment timeline ─────────────────────────────────────────────────────

    private function buildPaymentTimeline(): array
    {
        $typeMap = [
            PaymentStatus::Succeeded->value => 'order1',
            PaymentStatus::Pending->value   => 'order4',
            PaymentStatus::Failed->value    => 'order5',
        ];

        return Payment::with(['payable' => fn (MorphTo $q) => $q->morphWith([
                ServiceSubmission::class => ['user'],
                TicketOrder::class       => ['user'],
            ])])
            ->latest()->limit(5)->get()
            ->map(fn (Payment $payment) => [
                'id'    => (string) $payment->id,
                'title' => "Payment #{$payment->id} — {$payment->status->label()} · " . ($payment->payable?->user?->name ?? 'Unknown'),
                'type'  => $typeMap[$payment->status->value] ?? 'order1',
                'time'  => $payment->created_at->toISOString(),
            ])
            ->values()
            ->toArray();
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Returns a Collection keyed by "year-month" for fast O(1) lookup in sparkline loops.
     *
     * @param class-string $model Eloquent model class with SoftDeletes
     */
    private function monthlyCountIndex(string $model, Carbon $from, Carbon $to): Collection
    {
        return $model::selectRaw('YEAR(created_at) as yr, MONTH(created_at) as mo, COUNT(*) as cnt')
            ->whereBetween('created_at', [$from, $to])
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()
            ->keyBy(fn ($r) => "{$r->yr}-{$r->mo}");
    }

    private function pctChange(int $prev, int $curr): float
    {
        if ($prev === 0) {
            return $curr > 0 ? 100.0 : 0.0;
        }

        return round(($curr - $prev) / $prev * 100, 1);
    }
}
