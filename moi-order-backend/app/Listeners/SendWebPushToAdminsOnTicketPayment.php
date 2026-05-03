<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\TicketOrderPaymentProcessed;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: deliver a browser push to every admin when a
 *   ticket order payment completes.
 * Principle: OCP — existing NotifyAdminsOfTicketPayment listener is untouched.
 *
 * Listens to TicketOrderPaymentProcessed to share the lockForUpdate deduplication
 * from TicketOrder::markProcessing() — same rationale as the in-app listener.
 * $afterCommit: job enqueued only after the payment + status transaction commits.
 */
class SendWebPushToAdminsOnTicketPayment implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(TicketOrderPaymentProcessed $event): void
    {
        $order      = $event->ticketOrder->loadMissing(['user', 'ticket']);
        $userName   = $order->user?->name   ?? 'A user';
        $ticketName = $order->ticket?->name ?? 'a ticket';

        User::where('is_admin', true)->each(function (User $admin) use ($order, $userName, $ticketName): void {
            $this->webPush->sendToUser(
                $admin,
                'Payment Received',
                "{$userName} paid for {$ticketName}",
                ['type' => 'ticket_payment', 'order_id' => $order->id],
            );
        });
    }
}
