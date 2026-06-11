<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\Events\MerchantNotificationReceived;
use App\Events\OrderChatMessageSent;
use App\Models\DeviceToken;
use App\Models\MerchantNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to OrderChatMessageSent: persist DB notification +
 *   broadcast real-time signal + Expo push to merchant devices.
 * Principle: DIP — depends on PushNotificationInterface, not Expo SDK directly.
 *
 * Guards:
 *   - sender_type must be 'customer'; merchant/admin/system never self-notify.
 *   - 5-minute throttle per order: one chat_message notification per order per 5 min
 *     so a rapid burst of messages creates only a single inbox entry.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class NotifyMerchantOfChatMessage implements ShouldQueue
{
    public function __construct(private readonly PushNotificationInterface $push) {}

    public function handle(OrderChatMessageSent $event): void
    {
        $message = $event->message;

        if ($message->sender_type !== 'customer') {
            return;
        }

        $message->loadMissing('foodOrder.restaurant');
        $order      = $message->foodOrder;
        $merchantId = $order?->restaurant?->user_id;

        if ($merchantId === null) {
            Log::warning('NotifyMerchantOfChatMessage: could not resolve merchant', [
                'chat_message_id' => $message->id,
            ]);
            return;
        }

        // 5-minute throttle: skip if we already notified this merchant about this
        // order's chat in the last 5 minutes to avoid notification spam.
        $alreadyNotified = MerchantNotification::forMerchant($merchantId)
            ->where('type', 'chat_message')
            ->where('order_id', $order->id)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->exists();

        if ($alreadyNotified) {
            return;
        }

        $preview = $message->body !== null
            ? mb_strimwidth($message->body, 0, 80, '…')
            : 'Customer sent an image';

        $notification = MerchantNotification::create([
            'merchant_id' => $merchantId,
            'type'        => 'chat_message',
            'title'       => 'New Message',
            'body'        => $preview,
            'order_id'    => $order->id,
        ]);

        // Broadcast only after the row is committed so the app sees it on refetch.
        DB::afterCommit(function () use ($notification): void {
            event(new MerchantNotificationReceived($notification));
        });

        $tokens = DeviceToken::forUser($merchantId)
            ->where('platform', 'merchant')
            ->pluck('token')
            ->toArray();

        if (empty($tokens)) {
            return;
        }

        $this->push->send($tokens, new ExpoPushMessage(
            title: 'New Message',
            body:  $preview,
            data:  ['type' => 'chat_message', 'order_id' => $order->uuid],
        ));
    }
}
