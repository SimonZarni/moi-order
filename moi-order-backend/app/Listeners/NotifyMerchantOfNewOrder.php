<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\Events\NewFoodOrder;
use App\Models\DeviceToken;
use App\Models\MerchantNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to NewFoodOrder: push to merchant devices + persist DB notification.
 * Principle: DIP — depends on PushNotificationInterface, not Expo SDK directly.
 * ShouldQueue: listener failure never rolls back the order transaction.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT add Event::listen() in
 * AppServiceProvider for this listener — that would fire it twice.
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

        // ── 1. Persist in-app notification ───────────────────────────────────
        MerchantNotification::create([
            'merchant_id' => $merchantId,
            'type'        => 'new_order',
            'title'       => 'New Order!',
            'body'        => "Order {$order->order_number} — ฿" . number_format($order->total_cents / 100, 0),
            'order_id'    => $order->id,
        ]);

        // ── 2. Push to registered devices ────────────────────────────────────
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
