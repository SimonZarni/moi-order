<?php

declare(strict_types=1);

namespace App\Channels;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — bridges Laravel's notification system to the push adapter only.
 * Principle: DIP — depends on PushNotificationInterface, not the Expo service directly.
 *
 * Guard: returns early when the notifiable has no device tokens — safe, no exception.
 * Try-catch ensures push failure never prevents UserNotificationReceived from firing.
 */
class ExpoPushChannel
{
    public function __construct(
        private readonly PushNotificationInterface $push,
    ) {}

    public function send(mixed $notifiable, Notification $notification): void
    {
        try {
            $tokens = $notifiable->deviceTokens()->pluck('token')->toArray();

            if (empty($tokens)) {
                return;
            }

            /** @var ExpoPushMessage $message */
            $message = $notification->toExpoPush($notifiable);

            $this->push->send($tokens, $message);
        } catch (\Throwable $e) {
            // Push failure must never propagate — the Pusher broadcast (UserNotificationReceived)
            // fires after notify() returns, so an exception here would silently kill the
            // real-time badge update for the in-app bell.
            \Illuminate\Support\Facades\Log::warning('ExpoPushChannel: send failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
