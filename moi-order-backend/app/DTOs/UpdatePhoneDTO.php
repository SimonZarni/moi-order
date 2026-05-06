<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Profile\UpdatePhoneRequest;

readonly class UpdatePhoneDTO
{
    public function __construct(
        public string $otpRequestId,
        public string $phoneNumber,
        public string $otp,
    ) {}

    public static function fromRequest(UpdatePhoneRequest $request): self
    {
        return new self(
            otpRequestId: $request->string('otp_request_id')->toString(),
            phoneNumber:  $request->string('phone_number')->toString(),
            otp:          $request->string('otp')->toString(),
        );
    }
}
