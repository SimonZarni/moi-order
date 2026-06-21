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
