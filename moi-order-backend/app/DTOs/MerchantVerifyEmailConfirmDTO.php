<?php

declare(strict_types=1);

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class MerchantVerifyEmailConfirmDTO
{
    public function __construct(
        public string $otp,
        public string $newPassword,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            otp:         $request->string('otp')->toString(),
            newPassword: $request->string('password')->toString(),
        );
    }
}
