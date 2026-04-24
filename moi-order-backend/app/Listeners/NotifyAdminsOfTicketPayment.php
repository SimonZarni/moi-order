<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TicketOrderPaymentConfirmed;
use App\Events\UserNotificationReceived;
use App\Models\User;
use App\Notifications\Admin\NewPaymentNotification;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — one reaction: notify all admins when a ticket order payment is confirmed.
 * Timing: TicketOrderPaymentConfirmed fires inside DB::transaction.
 *   DB::afterCommit() defers notifications until after the commit — same guard
 *   pattern as NotifyAdminsOfServicePayment.
 */
class NotifyAdminsOfTicketPayment
{
    public function handle(TicketOrderPaymentConfirmed $event): void
    {
        $order = $event->ticketOrder->loadMissing(['user', 'ticket']);

        $ticketName = $order->ticket->name ?? 'a ticket';
        $body       = ($order->user->name ?? 'A user') . " paid for {$ticketName}";

        DB::afterCommit(function () use ($order, $body): void {
            User::where('is_admin', true)->each(function (User $admin) use ($order, $body): void {
                $admin->notify(new NewPaymentNotification($body, [
                    'ticket_order_id' => $order->id,
                ]));
                event(new UserNotificationReceived($admin));
            });
        });
    }
}
