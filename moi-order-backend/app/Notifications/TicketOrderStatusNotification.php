<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Enums\TicketOrderStatus;
use App\Models\TicketOrder;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: OCP — new status copy = update payload() only; no structural changes.
 * Principle: SRP — owns the ticket order notification payload exclusively.
 *
 * Channels: database (persisted) + broadcast (Pusher live update).
 */
class TicketOrderStatusNotification extends Notification
{
    public function __construct(
        private readonly TicketOrder $order,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->payload());
    }

    public function broadcastType(): string
    {
        return 'notification.created';
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
