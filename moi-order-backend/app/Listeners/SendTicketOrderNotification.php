<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\TicketOrderStatus;
use App\Events\TicketOrderStatusChanged;
use App\Notifications\TicketOrderStatusNotification;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — one reaction: notify the user when their ticket order status changes.
 * Timing: same DB::afterCommit() rationale as SendSubmissionNotification — Pusher must
 *   fire only after the notification row is committed so client refetches see the new row.
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

        DB::afterCommit(function () use ($order): void {
            $order->user->notify(new TicketOrderStatusNotification($order));
        });
    }
}
