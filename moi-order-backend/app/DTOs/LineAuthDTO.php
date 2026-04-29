<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\LineAuthRequest;
use Illuminate\Http\Request;

/**
 * Principle: SRP — carries the LINE identity token and optional verification data.
 * Principle: Immutability — readonly prevents accidental mutation.
 */
readonly class LineAuthDTO
{
    public function __construct(
        public string $idToken,
        public ?string $nonce,
        public ?string $name,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $nonce = trim($request->string('nonce')->toString());
        $name  = trim($request->string('name')->toString());

        return new self(
            idToken: $request->string('id_token')->toString(),
            nonce: $nonce !== '' ? $nonce : null,
            name: $name !== '' ? $name : null,
        );
    }
}
