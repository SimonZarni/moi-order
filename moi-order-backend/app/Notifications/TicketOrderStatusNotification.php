<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Enums\TicketOrderStatus;
use App\Models\TicketOrder;
use Illuminate\Notifications\Notification;

/**
 * Principle: OCP — new status copy = update payload() only; no structural changes.
 * Principle: SRP — owns the ticket order notification payload exclusively.
 *
 * Channel: database only — Pusher broadcast is handled by UserNotificationReceived
 *   (ShouldBroadcastNow), which fires synchronously from the listener after commit.
 */
class TicketOrderStatusNotification extends Notification
{
    public function __construct(
        private readonly TicketOrder $order,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    private function payload(): array
    {
        $isProcessing = $this->order->status === TicketOrderStatus::Processing;

        return [
            'notification_type' => 'ticket_order_status',
            'title'             => $isProcessing ? 'Ticket Booking Received' : 'E-Ticket Ready',
            'body'              => $isProcessing
                ? 'Your ticket booking is being processed.'
                : 'Your e-ticket is ready to download.',
            'ticket_order_id'   => $this->order->id,
            'status'            => $this->order->status->value,
        ];
    }
}
