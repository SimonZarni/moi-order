<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\ChangePasswordRequest;

readonly class ChangePasswordDTO
{
    public function __construct(
        public string $newPassword,
    ) {}

    public static function fromRequest(ChangePasswordRequest $request): self
    {
        return new self(
            newPassword: $request->string('password')->toString(),
        );
    }
}
