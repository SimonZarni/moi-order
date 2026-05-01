<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\SelfRegisterMerchantRequest;

readonly class SelfRegisterMerchantDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(SelfRegisterMerchantRequest $request): self
    {
        return new self(
            name:     $request->validated('name'),
            email:    $request->validated('email'),
            password: $request->validated('password'),
        );
    }
}
