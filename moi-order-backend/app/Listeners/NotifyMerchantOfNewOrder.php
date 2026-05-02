<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\Events\NewFoodOrder;
use App\Models\DeviceToken;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to NewFoodOrder by pushing to merchant devices only.
 * Principle: DIP — depends on PushNotificationInterface, not Expo SDK directly.
 * ShouldQueue: listener failure never rolls back the order transaction.
 */
class NotifyMerchantOfNewOrder implements ShouldQueue
{
    public function __construct(private readonly PushNotificationInterface $push) {}

    public function handle(NewFoodOrder $event): void
    {
        $order      = $event->order;
        $merchantId = $order->restaurant?->user_id;

        if ($merchantId === null) {
            Log::warning('NotifyMerchantOfNewOrder: restaurant has no user_id', ['order_id' => $order->id]);
            return;
        }

        $tokens = DeviceToken::forUser($merchantId)
            ->where('platform', 'merchant')
            ->pluck('token')
            ->toArray();

        if (empty($tokens)) {
            return;
        }

        $this->push->send($tokens, new ExpoPushMessage(
            title: 'New Order!',
            body:  "Order {$order->order_number} — ฿" . number_format($order->total_cents / 100, 0),
            data:  ['type' => 'new_order', 'order_id' => $order->id],
        ));
    }
}
