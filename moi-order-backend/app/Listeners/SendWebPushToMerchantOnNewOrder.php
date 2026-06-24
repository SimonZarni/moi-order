<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\NewFoodOrder;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to NewFoodOrder: delivers a Web Push notification to the
 *   merchant's registered browser(s) so they receive the alert even with the tab closed.
 * Principle: DIP — depends on WebPushInterface, not WebPushService directly.
 * ShouldQueue + $afterCommit: VAPID HTTP call must not block the order transaction,
 *   and only fires after the transaction commits (no phantom notifications).
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class SendWebPushToMerchantOnNewOrder implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(NewFoodOrder $event): void
    {
        $order      = $event->order;
        $merchantId = $order->restaurant?->user_id;

        if ($merchantId === null) {
            Log::warning('SendWebPushToMerchantOnNewOrder: restaurant has no user_id', [
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
            'New Order!',
            "Order {$order->order_number} — ฿" . number_format($order->total_cents / 100, 0),
            ['type' => 'new_order', 'order_id' => $order->uuid],
        );
    }
}
