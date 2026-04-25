<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\DTOs\PushToken;

/**
 * Principle: SRP — routes push tokens to the correct platform adapter only.
 * Principle: OCP — new platform = new service + one new case here, no other changes.
 *
 * Android → FcmPushNotificationService (native FCM token, tied to com.moiorder.app)
 * iOS     → ExpoPushNotificationService (Expo token relayed to APNs)
 */
class PushNotificationDispatcher implements PushNotificationInterface
{
    public function __construct(
        private readonly FcmPushNotificationService  $fcm,
        private readonly ExpoPushNotificationService $expo,
    ) {}

    /**
     * @param PushToken[] $tokens
     */
    public function send(array $tokens, ExpoPushMessage $message): void
    {
        $android = array_values(array_filter($tokens, fn (PushToken $t) => $t->platform === 'android'));
        $ios     = array_values(array_filter($tokens, fn (PushToken $t) => $t->platform === 'ios'));

        $this->fcm->sendAll($android, $message);
        $this->expo->sendAll($ios, $message);
    }
}
