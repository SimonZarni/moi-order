<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\FoodOrderStatus;
use App\Events\FoodOrderStatusUpdated;
use App\Events\OrderChatMessageSent;
use App\Models\OrderChatMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: when an order reaches a terminal status that
 *   starts the chat-purge clock, post a system notice into the chat thread.
 * Principle: OCP — existing FoodOrderStatusUpdated listeners are untouched.
 *
 * ShouldQueue + $afterCommit: listener failure never rolls back the status
 * transition, and the notice is only posted once the new status is committed.
 *
 * Guard: only posts when the chat thread already has messages — no point
 * warning about deletion of a chat nobody used.
 */
class PostChatDeletionNoticeOnOrderTerminal implements ShouldQueue
{
    public bool $afterCommit = true;

    private const NOTICE = 'This order is now %s. This chat will be permanently deleted in 3 hours.';

    public function handle(FoodOrderStatusUpdated $event): void
    {
        $order = $event->order;

        if (! in_array($order->status, [FoodOrderStatus::Completed, FoodOrderStatus::Cancelled], true)) {
            return;
        }

        $hasMessages = OrderChatMessage::query()->forOrder($order->id)->exists();
        if (! $hasMessages) {
            return;
        }

        $message = OrderChatMessage::postSystemMessage(
            $order->id,
            sprintf(self::NOTICE, $order->status->label()),
        );

        event(new OrderChatMessageSent($message));
    }
}
