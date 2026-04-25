<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\ExpoPushMessage;

/**
 * Principle: ISP — push-only contract, separate from other notification concerns.
 * Principle: DIP — domain code depends on this interface, not on Expo/FCM/APNs.
 */
interface PushNotificationInterface
{
    /**
     * @param string[] $tokens  Expo push token strings
     */
    public function send(array $tokens, ExpoPushMessage $message): void;
}
