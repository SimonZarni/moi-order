<?php

declare(strict_types=1);

namespace App\Notifications\Admin;

use App\Models\FoodOrder;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns the admin notification payload for new food orders.
 * Channel: database only — Pusher handled by AdminNotificationReceived event in listener.
 */
class NewFoodOrderNotification extends Notification
{
    public function __construct(
        private readonly FoodOrder $order,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $restaurantName = $this->order->restaurant->name ?? 'a restaurant';
        $userName       = $this->order->user->name       ?? 'A customer';

        return [
            'notification_type' => 'new_food_order',
            'title'             => 'New Food Order',
            'body'              => "{$userName} ordered from {$restaurantName}",
            'user_name'         => $userName,
            'object_name'       => $restaurantName,
            'food_order_id'     => $this->order->id,
        ];
    }
}
