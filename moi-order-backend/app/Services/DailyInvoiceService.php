<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\Enums\FoodOrderStatus;
use App\Events\CashOutConfirmed;
use App\Models\FoodOrder;
use App\Models\Restaurant;
use App\Models\RestaurantDailyInvoice;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — owns daily invoice generation, live calculation, and cashout confirmation.
 * Principle: DIP — depends on FileStorageInterface, never Storage::disk() directly.
 * Principle: CQS — generateForDate/confirmCashOut mutate; calculateForToday returns data.
 */
class DailyInvoiceService
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    /**
     * Generate (or update) stored invoices for every restaurant that had completed orders
     * on the given date. Idempotent — safe to re-run for the same date.
     * Restaurants with zero completed orders on that date are skipped.
     */
    public function generateForDate(Carbon $date): void
    {
        $dateStr = $date->toDateString();

        Restaurant::withoutTrashed()
            ->each(function (Restaurant $restaurant) use ($dateStr): void {
                $orders = FoodOrder::where('restaurant_id', $restaurant->id)
                    ->where('status', FoodOrderStatus::Completed->value)
                    ->whereDate('created_at', $dateStr)
                    ->get(['total_cents', 'subtotal_cents']);

                if ($orders->isEmpty()) {
                    return;
                }

                $customerTotal = (int) $orders->sum('total_cents');
                $payout        = (int) round($customerTotal / 1.05);
                $platformFee   = $customerTotal - $payout;

                RestaurantDailyInvoice::updateOrCreate(
                    ['restaurant_id' => $restaurant->id, 'date' => $dateStr],
                    [
                        'order_count'          => $orders->count(),
                        'customer_total_cents' => $customerTotal,
                        'platform_fee_cents'   => $platformFee,
                        'payout_cents'         => $payout,
                    ],
                );

                Log::info('DailyInvoiceService: generated invoice', [
                    'restaurant_id' => $restaurant->id,
                    'date'          => $dateStr,
                    'order_count'   => $orders->count(),
                    'payout_cents'  => $payout,
                ]);
            });
    }

    /**
     * Calculate today's provisional invoice totals for a restaurant without persisting.
     * Returns an unsaved RestaurantDailyInvoice ($model->exists === false) so the
     * Resource can set is_provisional: true transparently.
     */
    public function calculateForToday(Restaurant $restaurant): RestaurantDailyInvoice
    {
        $today = Carbon::today()->toDateString();

        $orders = FoodOrder::where('restaurant_id', $restaurant->id)
            ->where('status', FoodOrderStatus::Completed->value)
            ->whereDate('created_at', $today)
            ->get(['total_cents', 'subtotal_cents']);

        $customerTotal = (int) $orders->sum('total_cents');
        $payout        = (int) round($customerTotal / 1.05);
        $platformFee   = $customerTotal - $payout;

        return new RestaurantDailyInvoice([
            'restaurant_id'        => $restaurant->id,
            'date'                 => $today,
            'order_count'          => $orders->count(),
            'customer_total_cents' => $customerTotal,
            'platform_fee_cents'   => $platformFee,
            'payout_cents'         => $payout,
            'status'               => 'pending',
        ]);
    }

    /**
     * Mark an invoice as paid. Fires CashOutConfirmed event for downstream notification.
     * Principle: DB::transaction wraps the state mutation so the event only fires on commit.
     */
    public function confirmCashOut(RestaurantDailyInvoice $invoice, int $adminId): void
    {
        DB::transaction(function () use ($invoice, $adminId): void {
            $invoice->confirm($adminId);
            event(new CashOutConfirmed($invoice));
        });
    }

    /**
     * Upload or replace the restaurant's payment QR code.
     * Old path is deleted from storage after the new one is committed.
     */
    public function uploadPaymentQr(Restaurant $restaurant, UploadedFile $file): void
    {
        $oldPath = $restaurant->payment_qr_path;

        $newPath = $this->storage->store(
            $file,
            'payment-qr',
            ['image/jpeg', 'image/png', 'image/webp'],
        );

        $restaurant->update(['payment_qr_path' => $newPath]);

        if ($oldPath !== null) {
            $this->storage->delete($oldPath);
        }
    }
}
