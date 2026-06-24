<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\UploadPaymentQrRequest;
use App\Http\Resources\DailyInvoiceResource;
use App\Models\RestaurantDailyInvoice;
use App\Services\DailyInvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. One service call per action. No DB logic.
 */
class MerchantDailyInvoiceController extends Controller
{
    public function __construct(
        private readonly DailyInvoiceService $service,
        private readonly FileStorageInterface $storage,
    ) {}

    /**
     * Paginated invoice history (stored DB records, newest first).
     * GET /merchant/v1/invoices
     */
    public function index(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();
        if ($restaurant === null) {
            return response()->json(['message' => 'Restaurant not found.', 'code' => 'not_found'], 404);
        }

        $perPage   = min((int) $request->input('per_page', 20), 100);

        $paginator = RestaurantDailyInvoice::forRestaurant($restaurant->id)
            ->with('restaurant')
            ->orderByDesc('date')
            ->paginate($perPage);

        $items = $paginator->getCollection()->map(
            fn (RestaurantDailyInvoice $invoice) => new DailyInvoiceResource($invoice, $this->storage)
        );

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    /**
     * Aggregated summary for the current week or month.
     * Stored daily invoices are summed from the period, then today's provisional
     * live total is added on top (today's invoice is never stored mid-day).
     * GET /merchant/v1/invoices/summary?period=week|month
     */
    public function summary(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();
        if ($restaurant === null) {
            return response()->json(['message' => 'Restaurant not found.', 'code' => 'not_found'], 404);
        }

        $period = $request->input('period', 'week');
        $today  = now()->toDateString();

        if ($period === 'month') {
            $dateFrom = now()->startOfMonth()->toDateString();
            $dateTo   = $today;
        } else {
            $dateFrom = now()->startOfWeek()->toDateString();
            $dateTo   = $today;
        }

        // Sum all stored invoices within the period (excludes today — not yet persisted).
        $yesterdayOrEarlier = now()->subDay()->toDateString();
        $row = RestaurantDailyInvoice::forRestaurant($restaurant->id)
            ->whereBetween('date', [$dateFrom, $yesterdayOrEarlier])
            ->selectRaw('
                SUM(order_count)          AS order_count,
                SUM(customer_total_cents) AS customer_total_cents,
                SUM(platform_fee_cents)   AS platform_fee_cents,
                SUM(payout_cents)         AS payout_cents
            ')
            ->first();

        // Add today's provisional data so the weekly/monthly total is always current.
        $todayProvisional = $this->service->calculateForToday($restaurant);

        return response()->json([
            'data' => [
                'period'               => $period,
                'date_from'            => $dateFrom,
                'date_to'              => $dateTo,
                'order_count'          => (int) ($row->order_count          ?? 0) + $todayProvisional->order_count,
                'customer_total_cents' => (int) ($row->customer_total_cents ?? 0) + $todayProvisional->customer_total_cents,
                'platform_fee_cents'   => (int) ($row->platform_fee_cents   ?? 0) + $todayProvisional->platform_fee_cents,
                'payout_cents'         => (int) ($row->payout_cents         ?? 0) + $todayProvisional->payout_cents,
            ],
        ]);
    }

    /**
     * Today's live (provisional) invoice — calculated from orders, never persisted here.
     * GET /merchant/v1/invoices/today
     */
    public function today(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();
        if ($restaurant === null) {
            return response()->json(['message' => 'Restaurant not found.', 'code' => 'not_found'], 404);
        }

        $invoice = $this->service->calculateForToday($restaurant);
        $invoice->setRelation('restaurant', $restaurant);

        return response()->json([
            'data' => new DailyInvoiceResource($invoice, $this->storage),
        ]);
    }

    /**
     * Upload or replace the restaurant's payment QR code.
     * POST /merchant/v1/restaurant/payment-qr
     */
    public function uploadQr(UploadPaymentQrRequest $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->first();
        if ($restaurant === null) {
            return response()->json(['message' => 'Restaurant not found.', 'code' => 'not_found'], 404);
        }

        $this->service->uploadPaymentQr($restaurant, $request->file('qr_code'));

        $qrUrl = $this->storage->url($restaurant->fresh()->payment_qr_path);

        return response()->json([
            'message'        => 'Payment QR updated.',
            'payment_qr_url' => $qrUrl,
        ]);
    }
}
