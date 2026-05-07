<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\StoreAdminRequest;

readonly class CreateAdminAccountDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $verifiedToken,
    ) {}

    public static function fromRequest(StoreAdminRequest $request): self
    {
        return new self(
            name:          $request->string('name')->toString(),
            email:         $request->string('email')->lower()->toString(),
            password:      $request->string('password')->toString(),
            verifiedToken: $request->string('verified_token')->toString(),
        );
    }
}
