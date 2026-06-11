<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\OrderChatMessageSent;
use App\Events\UserNotificationReceived;
use App\Notifications\OrderChatMessageNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to OrderChatMessageSent by notifying the customer only.
 * Principle: DIP — depends on Laravel's Notifiable trait via $user->notify().
 *
 * Guards:
 *   - sender_type must be 'merchant'; customers/admin/system never self-notify.
 *   - 5-minute throttle per order: one chat notification per order per 5 min.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class NotifyCustomerOfChatMessage implements ShouldQueue
{
    public function handle(OrderChatMessageSent $event): void
    {
        $message = $event->message;

        if ($message->sender_type !== 'merchant') {
            return;
        }

        $message->loadMissing('foodOrder.user');
        $order = $message->foodOrder;
        $user  = $order?->user;

        if ($user === null) {
            Log::warning('NotifyCustomerOfChatMessage: could not resolve customer', [
                'chat_message_id' => $message->id,
            ]);
            return;
        }

        // 5-minute throttle: skip if a chat notification was already sent for this
        // order in the last 5 minutes to avoid spamming the customer.
        $alreadyNotified = $user->notifications()
            ->where('type', OrderChatMessageNotification::class)
            ->where('data->food_order_id', $order->uuid)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->exists();

        if ($alreadyNotified) {
            return;
        }

        $user->notify(new OrderChatMessageNotification($message));

        // Broadcast only after the DB row is committed so the app sees it on refetch.
        DB::afterCommit(function () use ($user): void {
            event(new UserNotificationReceived($user));
        });
    }
}
