<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\GoogleAuthRequest;

/**
 * Principle: SRP — carries the Google ID token from controller to service.
 * Principle: Immutability — readonly prevents accidental mutation.
 */
readonly class GoogleAuthDTO
{
    public function __construct(
        public string $idToken,
    ) {}

    public static function fromRequest(GoogleAuthRequest $request): self
    {
        return new self(
            idToken: $request->string('id_token')->toString(),
        );
    }
}
