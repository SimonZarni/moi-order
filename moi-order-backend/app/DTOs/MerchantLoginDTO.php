<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\MerchantLoginRequest;

readonly class MerchantLoginDTO
{
    public function __construct(
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(MerchantLoginRequest $request): self
    {
        return new self(
            email:    $request->validated('email'),
            password: $request->validated('password'),
        );
    }
}
