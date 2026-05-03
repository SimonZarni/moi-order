<?php

declare(strict_types=1);

namespace App\Http\DTOs;

use App\Http\Requests\Admin\StorePushSubscriptionRequest;

/**
 * Principle: SRP — immutable data carrier for push subscription creation.
 */
readonly class StorePushSubscriptionDTO
{
    public function __construct(
        public string $endpoint,
        public string $p256dhKey,
        public string $authKey,
    ) {}

    public static function fromRequest(StorePushSubscriptionRequest $request): self
    {
        return new self(
            endpoint:  $request->string('endpoint')->toString(),
            p256dhKey: $request->string('p256dh_key')->toString(),
            authKey:   $request->string('auth_key')->toString(),
        );
    }
}
