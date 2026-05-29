<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\MerchantCompleteRegistrationRequest;

readonly class MerchantCompleteRegistrationDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $verifiedToken,
    ) {}

    public static function fromRequest(MerchantCompleteRegistrationRequest $request): self
    {
        return new self(
            name:          trim($request->string('name')->toString()),
            email:         $request->string('email')->lower()->toString(),
            password:      $request->string('password')->toString(),
            verifiedToken: $request->string('verified_token')->toString(),
        );
    }
}
