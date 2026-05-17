<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\StoreAdminDirectRequest;

readonly class CreateAdminDirectDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {}

    public static function fromRequest(StoreAdminDirectRequest $request): self
    {
        return new self(
            name:     $request->string('name')->toString(),
            email:    $request->string('email')->lower()->toString(),
            password: $request->string('password')->toString(),
        );
    }
}
