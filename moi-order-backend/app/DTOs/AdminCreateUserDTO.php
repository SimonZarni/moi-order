<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminStoreUserRequest;

readonly class AdminCreateUserDTO
{
    public function __construct(
        public string  $name,
        public string  $email,
        public string  $password,
        public ?string $dateOfBirth,
        public bool    $isAdmin,
    ) {}

    public static function fromRequest(AdminStoreUserRequest $request): self
    {
        return new self(
            name:        $request->string('name')->toString(),
            email:       $request->string('email')->lower()->toString(),
            password:    $request->string('password')->toString(),
            dateOfBirth: $request->input('date_of_birth'),
            isAdmin:     $request->boolean('is_admin', false),
        );
    }
}
