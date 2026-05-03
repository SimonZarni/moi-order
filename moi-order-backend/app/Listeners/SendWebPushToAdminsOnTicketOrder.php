<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\TicketOrderCreated;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: deliver a browser push to every admin when a new
 *   ticket order is placed.
 * Principle: OCP — existing NotifyAdminsOfNewTicketOrder listener is untouched.
 * ShouldQueue + $afterCommit: same rationale as SendWebPushToAdminsOnSubmission.
 */
class SendWebPushToAdminsOnTicketOrder implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(TicketOrderCreated $event): void
    {
        $order      = $event->order->loadMissing(['user', 'ticket']);
        $userName   = $order->user?->name   ?? 'A user';
        $ticketName = $order->ticket?->name ?? 'a ticket';

        User::where('is_admin', true)->each(function (User $admin) use ($order, $userName, $ticketName): void {
            $this->webPush->sendToUser(
                $admin,
                'New Ticket Order',
                "{$userName} ordered {$ticketName}",
                ['type' => 'ticket_order', 'order_id' => $order->id],
            );
        });
    }
}
