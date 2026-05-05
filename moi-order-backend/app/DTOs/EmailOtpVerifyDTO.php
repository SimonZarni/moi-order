<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\EmailOtpVerifyRequest;

readonly class EmailOtpVerifyDTO
{
    public function __construct(
        public string $otpRequestId,
        public string $email,
        public string $code,
        public string $purpose,
        public ?string $name,
    ) {}

    public static function fromRequest(EmailOtpVerifyRequest $request): self
    {
        $name = trim($request->string('name')->toString());

        return new self(
            otpRequestId: $request->string('otp_request_id')->toString(),
            email: $request->string('email')->toString(),
            code: $request->string('code')->toString(),
            purpose: $request->string('purpose')->toString(),
            name: $name !== '' ? $name : null,
        );
    }
}
