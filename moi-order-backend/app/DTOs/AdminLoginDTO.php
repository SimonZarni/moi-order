<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminLoginRequest;

readonly class AdminLoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(AdminLoginRequest $request): self
    {
        return new self(
            email:    $request->string('email')->lower()->toString(),
            password: $request->string('password')->toString(),
        );
    }
}
