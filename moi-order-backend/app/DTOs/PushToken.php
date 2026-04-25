<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * Carries a device push token and its platform so the dispatcher can route
 * Android tokens to FCM and iOS tokens to Expo/APNs.
 */
readonly class PushToken
{
    public function __construct(
        public string $token,
        public string $platform, // 'android' | 'ios'
    ) {}
}
