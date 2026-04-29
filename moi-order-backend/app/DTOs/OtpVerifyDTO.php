<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\OtpVerifyRequest;

readonly class OtpVerifyDTO
{
    public function __construct(
        public string $otpRequestId,
        public string $phoneNumber,
        public string $pin,
        public string $purpose,
        public ?string $name,
    ) {}

    public static function fromRequest(OtpVerifyRequest $request): self
    {
        $name = trim($request->string('name')->toString());

        return new self(
            otpRequestId: $request->string('otp_request_id')->toString(),
            phoneNumber: $request->string('phone_number')->toString(),
            pin: $request->string('pin')->toString(),
            purpose: $request->string('purpose')->toString(),
            name: $name !== '' ? $name : null,
        );
    }
}
