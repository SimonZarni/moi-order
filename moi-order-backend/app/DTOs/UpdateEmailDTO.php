<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Profile\UpdateEmailRequest;

readonly class UpdateEmailDTO
{
    public function __construct(
        public string $email,
        public string $otp,
    ) {}

    public static function fromRequest(UpdateEmailRequest $request): self
    {
        return new self(
            email: $request->string('email')->lower()->toString(),
            otp:   $request->string('otp')->toString(),
        );
    }
}
