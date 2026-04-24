<?php

declare(strict_types=1);

namespace App\Notifications\Admin;

use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns the admin payment notification payload.
 * Principle: OCP — caller supplies the payload data; this class never inspects types.
 *   Service payment → ['submission_id' => uuid]
 *   Ticket payment  → ['ticket_order_id' => uuid]
 * Channel: database only — Pusher handled by UserNotificationReceived in listener.
 */
class NewPaymentNotification extends Notification
{
    /**
     * @param  array<string, mixed>  $data  submission_id or ticket_order_id
     */
    public function __construct(
        private readonly string $body,
        private readonly array $data,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return array_merge([
            'notification_type' => 'new_payment',
            'title'             => 'Payment Received',
            'body'              => $this->body,
        ], $this->data);
    }
}
