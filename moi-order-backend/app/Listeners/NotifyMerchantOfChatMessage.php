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
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to OrderChatMessageSent: persist DB notification +
 *   broadcast real-time signal + Expo push to merchant devices.
 * Principle: DIP — depends on PushNotificationInterface, not Expo SDK directly.
 *
 * Guards:
 *   - sender_type must not be 'merchant'; customer and admin messages both notify.
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

        // Notify for any sender that isn't the merchant — both customer and admin messages.
        if ($message->sender_type === 'merchant') {
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

        // 5-minute throttle: skip creating a new DB notification row if we already
        // created one for this order recently — but always broadcast the real-time
        // WebSocket signal so the merchant's bell rings for every message.
        $alreadyNotified = MerchantNotification::forMerchant($merchantId)
            ->where('type', 'chat_message')
            ->where('order_id', $order->id)
            ->where('created_at', '>=', now()->subMinutes(5))
            ->exists();

        if ($alreadyNotified) {
            $existing = MerchantNotification::forMerchant($merchantId)
                ->where('type', 'chat_message')
                ->where('order_id', $order->id)
                ->latest()
                ->first();
            if ($existing !== null) {
                event(new MerchantNotificationReceived($existing));
            }
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

        // create() auto-commits; fire the broadcast directly.
        event(new MerchantNotificationReceived($notification));

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
