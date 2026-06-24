<?php

declare(strict_types=1);

namespace App\Http\DTOs;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Principle: SRP — immutable data carrier for push subscription creation.
 * Accepts the base FormRequest so both Admin and Merchant controllers can use it.
 */
readonly class StorePushSubscriptionDTO
{
    public function __construct(
        public string $endpoint,
        public string $p256dhKey,
        public string $authKey,
    ) {}

    public static function fromRequest(FormRequest $request): self
    {
        return new self(
            endpoint:  $request->string('endpoint')->toString(),
            p256dhKey: $request->string('p256dh_key')->toString(),
            authKey:   $request->string('auth_key')->toString(),
        );
    }
}
