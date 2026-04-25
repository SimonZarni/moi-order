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
 * Laravel resolves this channel from the container whenever it appears in via().
 * PushNotificationInterface must be bound in AppServiceProvider for auto-wiring to work.
 *
 * Guard: returns early when the notifiable has no device tokens — safe, no exception.
 */
class ExpoPushChannel
{
    public function __construct(
        private readonly PushNotificationInterface $push,
    ) {}

    public function send(mixed $notifiable, Notification $notification): void
    {
        $tokens = $notifiable->deviceTokens()->pluck('token')->toArray();

        if (empty($tokens)) {
            return;
        }

        /** @var ExpoPushMessage $message */
        $message = $notification->toExpoPush($notifiable);

        $this->push->send($tokens, $message);
    }
}
