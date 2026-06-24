<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\AdminNotificationReceived;
use App\Events\NewFoodOrder;
use App\Models\User;
use App\Notifications\Admin\NewFoodOrderNotification;

/**
 * Principle: SRP — one reaction: persist a DB notification for every admin
 *   when a new food order is placed, and fire the Pusher ping.
 *
 * This listener handles the in-app notification DB row only.
 * Browser push (VAPID) is handled separately by SendWebPushToAdminsOnNewFoodOrder.
 *
 * Auto-discovered by Laravel — do NOT register in AppServiceProvider.
 */
class NotifyAdminsOfNewFoodOrder
{
    public function handle(NewFoodOrder $event): void
    {
        $order = $event->order->loadMissing(['user', 'restaurant']);

        User::where('is_admin', true)->each(function (User $admin) use ($order): void {
            $admin->notify(new NewFoodOrderNotification($order));
            event(new AdminNotificationReceived($admin, 'new_food_order'));
        });
    }
}
