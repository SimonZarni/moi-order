<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use App\Models\OrderChatMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — notifies the customer when a merchant sends a chat message.
 * Channels: database (in-app bell) + ExpoPushChannel (OS banner).
 * Pusher broadcast is handled separately by UserNotificationReceived (ShouldBroadcastNow),
 * fired in NotifyCustomerOfChatMessage after notify() returns — same pattern as
 * FoodOrderStatusNotification.
 */
class OrderChatMessageNotification extends Notification
{
    public function __construct(private readonly OrderChatMessage $message) {}

    public function via(object $notifiable): array
    {
        return ['database', ExpoPushChannel::class];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'notification_type' => 'chat_message',
            'title'             => 'New Message',
            'body'              => $this->preview(),
            'food_order_id'     => $this->message->foodOrder->uuid,
        ];
    }

    public function toExpoPush(object $notifiable): ExpoPushMessage
    {
        return new ExpoPushMessage(
            title: 'New Message',
            body:  $this->preview(),
            data:  [
                'notification_type' => 'chat_message',
                'food_order_id'     => $this->message->foodOrder->uuid,
            ],
        );
    }

    private function preview(): string
    {
        return $this->message->body !== null
            ? mb_strimwidth($this->message->body, 0, 80, '…')
            : 'Merchant sent an image';
    }
}
