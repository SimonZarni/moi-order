<?php

declare(strict_types=1);

namespace App\Notifications\Admin;

use App\Models\TicketOrder;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns the admin notification payload for new ticket orders.
 * Channel: database only — Pusher handled by UserNotificationReceived in listener.
 */
class NewTicketOrderNotification extends Notification
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
        $ticketName = $this->order->ticket->name ?? 'a ticket';
        $userName   = $this->order->user->name   ?? 'A user';

        return [
            'notification_type' => 'new_ticket_order',
            'title'             => 'New Ticket Booking',
            'body'              => "{$userName} booked {$ticketName}",
            'ticket_order_id'   => $this->order->id,
        ];
    }
}
