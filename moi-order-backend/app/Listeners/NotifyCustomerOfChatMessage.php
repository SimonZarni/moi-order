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
 * Guard: sender_type must be 'merchant'; customers/admin/system never self-notify.
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

        $user->notify(new OrderChatMessageNotification($message));

        // Broadcast only after the DB row is committed so the app sees it on refetch.
        // Pass food_order_id (UUID) so the mobile client can immediately invalidate
        // the correct chat query without waiting for the next poll cycle.
        $orderUuid = $order->uuid;
        DB::afterCommit(function () use ($user, $orderUuid): void {
            event(new UserNotificationReceived($user, [
                'type'          => 'chat_message',
                'food_order_id' => $orderUuid,
            ]));
        });
    }
}
