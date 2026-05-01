<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\MerchantOtpVerifyRequest;

/**
 * Principle: SRP — plain typed value object for merchant OTP verification.
 */
readonly class MerchantOtpVerifyDTO
{
    public function __construct(
        public string $phoneNumber,
        public string $otpRequestId,
        public string $pin,
    ) {}

    public static function fromRequest(MerchantOtpVerifyRequest $request): self
    {
        return new self(
            phoneNumber:  $request->validated('phone_number'),
            otpRequestId: $request->validated('otp_request_id'),
            pin:          $request->validated('pin'),
        );
    }
}
