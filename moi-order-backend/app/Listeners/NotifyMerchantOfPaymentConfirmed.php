<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\Enums\FoodOrderStatus;
use App\Events\FoodOrderStatusUpdated;
use App\Models\DeviceToken;
use App\Models\MerchantNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to FoodOrderStatusUpdated: notifies the merchant when
 *   admin confirms payment so they can start preparing the food immediately.
 * Principle: DIP — depends on PushNotificationInterface, not Expo SDK directly.
 * ShouldQueue + $afterCommit: VAPID/Expo HTTP calls must not block the status
 *   transition transaction, and only fire after it commits.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT add
 * Event::listen() in AppServiceProvider — that would fire it twice.
 */
class NotifyMerchantOfPaymentConfirmed implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly PushNotificationInterface $push) {}

    public function handle(FoodOrderStatusUpdated $event): void
    {
        $order = $event->order;

        if ($order->status !== FoodOrderStatus::PaymentConfirmed) {
            return;
        }

        $merchantId = $order->restaurant?->user_id;

        if ($merchantId === null) {
            Log::warning('NotifyMerchantOfPaymentConfirmed: restaurant has no user_id', ['order_id' => $order->id]);
            return;
        }

        MerchantNotification::create([
            'merchant_id' => $merchantId,
            'type'        => 'order_status',
            'title'       => 'Payment Confirmed',
            'body'        => "Order {$order->order_number} — payment confirmed. Please start preparing.",
            'order_id'    => $order->id,
        ]);

        $tokens = DeviceToken::forUser($merchantId)
            ->where('platform', 'merchant')
            ->pluck('token')
            ->toArray();

        if (empty($tokens)) {
            return;
        }

        $this->push->send($tokens, new ExpoPushMessage(
            title: 'Payment Confirmed',
            body:  "Order {$order->order_number} — payment confirmed. Please start preparing.",
            data:  ['type' => 'payment_confirmed', 'order_id' => $order->uuid],
        ));
    }
}
