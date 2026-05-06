<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\EmailOtpPurpose;
use App\Http\Requests\Auth\VerifyEmailOtpRequest;

readonly class VerifyEmailOtpDTO
{
    public function __construct(
        public string          $email,
        public string          $otp,
        public EmailOtpPurpose $purpose,
    ) {}

    public static function fromRequest(VerifyEmailOtpRequest $request): self
    {
        return new self(
            email:   $request->string('email')->lower()->toString(),
            otp:     $request->string('otp')->toString(),
            purpose: EmailOtpPurpose::from($request->string('purpose')->toString()),
        );
    }
}
