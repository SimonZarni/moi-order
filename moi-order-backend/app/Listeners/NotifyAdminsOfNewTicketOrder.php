<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TicketOrderCreated;
use App\Events\UserNotificationReceived;
use App\Models\User;
use App\Notifications\Admin\NewTicketOrderNotification;

/**
 * Principle: SRP — one reaction: notify all admins when a new ticket order is created.
 * Timing: TicketOrderCreated fires AFTER the transaction commits in
 *   TicketOrderService, so no DB::afterCommit() needed.
 */
class NotifyAdminsOfNewTicketOrder
{
    public function handle(TicketOrderCreated $event): void
    {
        $order = $event->order->loadMissing(['user', 'ticket']);

        User::where('is_admin', true)->each(function (User $admin) use ($order): void {
            $admin->notify(new NewTicketOrderNotification($order));
            event(new UserNotificationReceived($admin));
        });
    }
}
