<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\LoginRequest;

readonly class LoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(LoginRequest $request): self
    {
        return new self(
            email:    $request->string('email')->lower()->toString(),
            password: $request->string('password')->toString(),
        );
    }
}
