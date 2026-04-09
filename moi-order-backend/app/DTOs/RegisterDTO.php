<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\RegisterRequest;

readonly class RegisterDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(RegisterRequest $request): self
    {
        return new self(
            name:     $request->string('name')->toString(),
            email:    $request->string('email')->lower()->toString(),
            password: $request->string('password')->toString(),
        );
    }
}
