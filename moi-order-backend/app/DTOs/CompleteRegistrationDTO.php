<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Auth\CompleteRegistrationRequest;

readonly class CompleteRegistrationDTO
{
    public function __construct(
        public string $email,
        public string $name,
        public string $password,
        public string $verifiedToken,
    ) {}

    public static function fromRequest(CompleteRegistrationRequest $request): self
    {
        return new self(
            email:         $request->string('email')->lower()->toString(),
            name:          trim($request->string('name')->toString()),
            password:      $request->string('password')->toString(),
            verifiedToken: $request->string('verified_token')->toString(),
        );
    }
}
