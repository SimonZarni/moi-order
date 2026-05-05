<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\EmailOtpRequestRequest;

readonly class EmailOtpRequestDTO
{
    public function __construct(
        public string $email,
        public string $purpose,
    ) {}

    public static function fromRequest(EmailOtpRequestRequest $request): self
    {
        return new self(
            email: $request->string('email')->toString(),
            purpose: $request->string('purpose')->toString(),
        );
    }
}
