<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Enums\FoodOrderStatus;
use App\Events\FoodOrderStatusUpdated;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to FoodOrderStatusUpdated (PaymentConfirmed only): delivers a
 *   Web Push to the merchant's browser so they can start preparing immediately.
 * Principle: DIP — depends on WebPushInterface, not WebPushService directly.
 * ShouldQueue + $afterCommit: fires after the status transition commits.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class SendWebPushToMerchantOnPaymentConfirmed implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(FoodOrderStatusUpdated $event): void
    {
        $order = $event->order;

        if ($order->status !== FoodOrderStatus::PaymentConfirmed) {
            return;
        }

        $merchantId = $order->restaurant?->user_id;

        if ($merchantId === null) {
            Log::warning('SendWebPushToMerchantOnPaymentConfirmed: restaurant has no user_id', [
                'order_id' => $order->id,
            ]);
            return;
        }

        $merchant = User::find($merchantId);

        if ($merchant === null) {
            return;
        }

        $this->webPush->sendToUser(
            $merchant,
            'Payment Confirmed',
            "Order {$order->order_number} — payment confirmed. Please start preparing.",
            ['type' => 'payment_confirmed', 'order_id' => $order->uuid],
        );
    }
}
