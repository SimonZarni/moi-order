<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\TicketOrderStatus;
use App\Events\TicketOrderStatusChanged;
use App\Notifications\TicketOrderStatusNotification;
/**
 * Principle: SRP — one reaction: notify the user when their ticket order status changes.
 * Synchronous: QUEUE_CONNECTION=sync makes ShouldQueue + afterCommit fire twice (once
 *   via immediate sync dispatch, once via DB::afterCommit callback). Running synchronously
 *   fires exactly once. Acceptable because notification sending is fast.
 * Guard: only notifies for statuses the user cares about (Processing, Completed).
 */
class SendTicketOrderNotification
{
    public function handle(TicketOrderStatusChanged $event): void
    {
        $order = $event->order->loadMissing('user');

        if (! in_array($order->status, [
            TicketOrderStatus::Processing,
            TicketOrderStatus::Completed,
        ], true)) {
            return;
        }

        $order->user->notify(new TicketOrderStatusNotification($order));
    }
}
