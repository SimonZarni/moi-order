<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ConfirmCashOutRequest;
use App\Http\Requests\Admin\GenerateInvoicesRequest;
use App\Http\Resources\DailyInvoiceResource;
use App\Models\RestaurantDailyInvoice;
use App\Services\DailyInvoiceService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. One service call per action. No DB logic.
 */
class AdminDailyInvoiceController extends Controller
{
    public function __construct(
        private readonly DailyInvoiceService $service,
        private readonly FileStorageInterface $storage,
    ) {}

    /**
     * List all restaurants' invoices for a given date, with aggregate totals in meta.
     * GET /admin/v1/daily-invoices?date=YYYY-MM-DD&per_page=20
     */
    public function index(Request $request): JsonResponse
    {
        $date      = $request->input('date', Carbon::today()->toDateString());
        $perPage   = min((int) $request->input('per_page', 20), 100);

        $paginator = RestaurantDailyInvoice::forDate($date)
            ->with('restaurant')
            ->orderBy('payout_cents', 'desc')
            ->paginate($perPage);

        $totals = RestaurantDailyInvoice::forDate($date)->selectRaw(
            'COUNT(*) as restaurant_count,
             COALESCE(SUM(order_count), 0) as total_orders,
             COALESCE(SUM(customer_total_cents), 0) as total_customer_cents,
             COALESCE(SUM(platform_fee_cents), 0) as total_platform_fee_cents,
             COALESCE(SUM(payout_cents), 0) as total_payout_cents'
        )->first();

        $items = $paginator->getCollection()->map(
            fn (RestaurantDailyInvoice $invoice) => new DailyInvoiceResource($invoice, $this->storage)
        );

        return response()->json([
            'data' => $items,
            'meta' => [
                'current_page'           => $paginator->currentPage(),
                'last_page'              => $paginator->lastPage(),
                'per_page'               => $paginator->perPage(),
                'total'                  => $paginator->total(),
                'date'                   => $date,
                'restaurant_count'       => (int) ($totals->restaurant_count ?? 0),
                'total_orders'           => (int) ($totals->total_orders ?? 0),
                'total_customer_cents'   => (int) ($totals->total_customer_cents ?? 0),
                'total_platform_fee_cents' => (int) ($totals->total_platform_fee_cents ?? 0),
                'total_payout_cents'     => (int) ($totals->total_payout_cents ?? 0),
            ],
        ]);
    }

    /**
     * Confirm cashout for a specific invoice.
     * POST /admin/v1/daily-invoices/{id}/confirm
     */
    public function confirm(ConfirmCashOutRequest $request, int $id): JsonResponse
    {
        $invoice = RestaurantDailyInvoice::with('restaurant')->findOrFail($id);
        $adminId = $request->user()->int_id ?? $request->user()->id;

        $this->service->confirmCashOut($invoice, (int) $adminId);

        return response()->json([
            'data'    => new DailyInvoiceResource($invoice->fresh('restaurant'), $this->storage),
            'message' => 'Cashout confirmed.',
        ]);
    }

    /**
     * Manually trigger invoice generation for a specific date.
     * POST /admin/v1/daily-invoices/generate
     */
    public function generate(GenerateInvoicesRequest $request): JsonResponse
    {
        $date = Carbon::createFromFormat('Y-m-d', $request->validated('date'));

        $this->service->generateForDate($date);

        return response()->json(['message' => "Invoices generated for {$date->toDateString()}."]);
    }
}
