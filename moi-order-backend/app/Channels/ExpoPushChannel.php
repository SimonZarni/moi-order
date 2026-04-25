<?php

declare(strict_types=1);

namespace App\Channels;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\DTOs\PushToken;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — bridges Laravel's notification system to the push dispatcher only.
 * Principle: DIP — depends on PushNotificationInterface, not any concrete adapter.
 *
 * Passes PushToken DTOs (token + platform) so the dispatcher can route
 * Android tokens to FCM and iOS tokens to Expo/APNs.
 */
class ExpoPushChannel
{
    public function __construct(
        private readonly PushNotificationInterface $push,
    ) {}

    public function send(mixed $notifiable, Notification $notification): void
    {
        $tokens = $notifiable->deviceTokens()
            ->get(['token', 'platform'])
            ->map(fn ($row) => new PushToken($row->token, $row->platform))
            ->toArray();

        if (empty($tokens)) {
            return;
        }

        /** @var ExpoPushMessage $message */
        $message = $notification->toExpoPush($notifiable);

        $this->push->send($tokens, $message);
    }
}
