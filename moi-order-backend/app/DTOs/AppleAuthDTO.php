<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\AppleAuthRequest;
use Illuminate\Http\Request;

/**
 * Principle: SRP — carries the Apple identity token and optional profile fields.
 * Principle: Immutability — readonly prevents accidental mutation.
 */
readonly class AppleAuthDTO
{
    public function __construct(
        public string $idToken,
        public ?string $email,
        public ?string $name,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $email = trim($request->string('email')->toString());
        $name  = trim($request->string('name')->toString());

        return new self(
            idToken: $request->string('id_token')->toString(),
            email: $email !== '' ? $email : null,
            name: $name !== '' ? $name : null,
        );
    }
}
