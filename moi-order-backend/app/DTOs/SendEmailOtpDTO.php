<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\EmailOtpPurpose;
use App\Http\Requests\Auth\SendEmailOtpRequest;

readonly class SendEmailOtpDTO
{
    public function __construct(
        public string          $email,
        public EmailOtpPurpose $purpose,
    ) {}

    public static function fromRequest(SendEmailOtpRequest $request): self
    {
        return new self(
            email:   $request->string('email')->lower()->toString(),
            purpose: EmailOtpPurpose::from($request->string('purpose')->toString()),
        );
    }
}
