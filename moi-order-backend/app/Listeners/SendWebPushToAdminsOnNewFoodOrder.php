<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\NewFoodOrder;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: deliver a browser push to every admin when a new
 *   food order is placed.
 * Principle: OCP — existing NotifyMerchantOfNewOrder listener is untouched;
 *   admin delivery is added as a separate listener class.
 * Principle: DIP — depends on WebPushInterface, never on the minishlink SDK directly.
 *
 * ShouldQueue + $afterCommit: same rationale as SendWebPushToAdminsOnSubmission —
 * VAPID HTTP calls must not block the request, and only fire after the order
 * transaction commits.
 */
class SendWebPushToAdminsOnNewFoodOrder implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(NewFoodOrder $event): void
    {
        $order          = $event->order->loadMissing(['user', 'restaurant']);
        $customerName   = $order->user?->name ?? 'A customer';
        $restaurantName = $order->restaurant?->name ?? 'a restaurant';

        User::where('is_admin', true)->each(function (User $admin) use ($order, $customerName, $restaurantName): void {
            $this->webPush->sendToUser(
                $admin,
                'New Food Order',
                "{$customerName} ordered from {$restaurantName} — Order {$order->order_number}",
                ['type' => 'food_order', 'order_id' => $order->id],
            );
        });
    }
}
