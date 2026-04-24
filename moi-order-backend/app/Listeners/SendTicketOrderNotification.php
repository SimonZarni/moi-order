<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\TicketOrderStatus;
use App\Events\TicketOrderStatusChanged;
use App\Notifications\TicketOrderStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: notify the user when their ticket order status changes.
 * Queued + afterCommit: dispatched only after the wrapping DB transaction commits.
 * Guard: only notifies for statuses the user cares about (Processing, Completed).
 */
class SendTicketOrderNotification implements ShouldQueue
{
    public bool $afterCommit = true;

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
