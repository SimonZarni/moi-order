<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use App\Models\FoodOrder;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — order-edit notification payload only.
 * Channels: database (in-app bell) + ExpoPushChannel (OS banner).
 */
class FoodOrderEditedNotification extends Notification
{
    public function __construct(private readonly FoodOrder $order) {}

    public function via(object $notifiable): array
    {
        return ['database', ExpoPushChannel::class];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'notification_type' => 'food_order_status',
            'title'             => 'Order Updated',
            'body'              => "Order {$this->order->order_number} has been updated by the restaurant.",
            'food_order_id'     => $this->order->uuid,
        ];
    }

    public function toExpoPush(object $notifiable): ExpoPushMessage
    {
        return new ExpoPushMessage(
            title: 'Order Updated',
            body:  "Order {$this->order->order_number} has been updated by the restaurant.",
            data:  [
                'notification_type' => 'food_order_status',
                'food_order_id'     => $this->order->uuid,
            ],
        );
    }
}
