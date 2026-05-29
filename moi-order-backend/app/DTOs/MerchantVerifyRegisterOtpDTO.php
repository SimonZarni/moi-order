<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\MerchantVerifyRegisterOtpRequest;

readonly class MerchantVerifyRegisterOtpDTO
{
    public function __construct(
        public string $email,
        public string $otp,
    ) {}

    public static function fromRequest(MerchantVerifyRegisterOtpRequest $request): self
    {
        return new self(
            email: $request->string('email')->lower()->toString(),
            otp:   $request->string('otp')->toString(),
        );
    }
}
