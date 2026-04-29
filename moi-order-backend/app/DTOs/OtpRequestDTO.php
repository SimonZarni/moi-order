<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\OtpRequestRequest;

readonly class OtpRequestDTO
{
    public function __construct(
        public string $phoneNumber,
        public string $purpose,
    ) {}

    public static function fromRequest(OtpRequestRequest $request): self
    {
        return new self(
            phoneNumber: $request->string('phone_number')->toString(),
            purpose: $request->string('purpose')->toString(),
        );
    }
}
