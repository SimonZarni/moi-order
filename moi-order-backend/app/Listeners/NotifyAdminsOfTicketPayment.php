<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TicketOrderPaymentProcessed;
use App\Events\AdminNotificationReceived;
use App\Models\User;
use App\Notifications\Admin\NewPaymentNotification;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — one reaction: notify all admins when a ticket order payment
 *   is confirmed AND the order has transitioned to Processing.
 *
 * Listens to TicketOrderPaymentProcessed (not TicketOrderPaymentConfirmed) to share
 * the same lockForUpdate deduplication in TicketOrder::markProcessing() — same
 * pattern as NotifyAdminsOfServicePayment.
 */
class NotifyAdminsOfTicketPayment
{
    public function handle(TicketOrderPaymentProcessed $event): void
    {
        $order = $event->ticketOrder->loadMissing(['user', 'ticket']);

        $ticketName = $order->ticket->name ?? 'a ticket';
        $userName   = $order->user->name  ?? 'A user';
        $body       = "{$userName} paid for {$ticketName}";

        DB::afterCommit(function () use ($order, $body, $userName, $ticketName): void {
            User::where('is_admin', true)->each(function (User $admin) use ($order, $body, $userName, $ticketName): void {
                $admin->notify(new NewPaymentNotification($body, [
                    'ticket_order_id' => $order->id,
                    'user_name'       => $userName,
                    'object_name'     => $ticketName,
                ]));
                event(new AdminNotificationReceived($admin, 'new_payment'));
            });
        });
    }
}
