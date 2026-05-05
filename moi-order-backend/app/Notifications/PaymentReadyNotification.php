<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — notifies a customer that admin has authorised their order for payment.
 * Sent via database (in-app bell) + ExpoPushChannel (OS banner).
 */
class PaymentReadyNotification extends Notification
{
    public function __construct(
        private readonly string $orderType,  // 'ticket_order' | 'submission'
        private readonly int    $orderId,
        private readonly string $orderName,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', ExpoPushChannel::class];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'notification_type' => 'payment_ready',
            'order_type'        => $this->orderType,
            'order_id'          => $this->orderId,
            'title'             => 'Payment Confirmed',
            'body'              => $this->body(),
        ];
    }

    public function toExpoPush(object $notifiable): ExpoPushMessage
    {
        return new ExpoPushMessage(
            title: 'Payment Confirmed ✅',
            body:  $this->body(),
            data:  [
                'notification_type' => 'payment_ready',
                'order_type'        => $this->orderType,
                'order_id'          => $this->orderId,
            ],
        );
    }

    private function body(): string
    {
        return "Your order \"{$this->orderName}\" has been confirmed. Tap to proceed with payment.";
    }
}
