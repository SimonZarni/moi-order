<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\MerchantOtpRequestRequest;

/**
 * Principle: SRP — plain typed value object for merchant OTP request.
 */
readonly class MerchantOtpRequestDTO
{
    public function __construct(
        public string $phoneNumber,
    ) {}

    public static function fromRequest(MerchantOtpRequestRequest $request): self
    {
        return new self(
            phoneNumber: $request->validated('phone_number'),
        );
    }
}
