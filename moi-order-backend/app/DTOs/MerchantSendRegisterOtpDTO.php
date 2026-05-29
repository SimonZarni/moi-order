<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\MerchantSendRegisterOtpRequest;

readonly class MerchantSendRegisterOtpDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(MerchantSendRegisterOtpRequest $request): self
    {
        return new self(
            name:     trim($request->string('name')->toString()),
            email:    $request->string('email')->lower()->toString(),
            password: $request->string('password')->toString(),
        );
    }
}
