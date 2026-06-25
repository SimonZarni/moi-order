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
        public ?string $phoneNumber,
        public ?string $dateOfBirth,
        public bool    $isAdmin,
    ) {}

    public static function fromRequest(AdminStoreUserRequest $request): self
    {
        return new self(
            name:        $request->string('name')->toString(),
            email:       $request->string('email')->lower()->toString(),
            password:    $request->string('password')->toString(),
            phoneNumber: $request->filled('phone_number') ? $request->string('phone_number')->toString() : null,
            dateOfBirth: $request->input('date_of_birth'),
            isAdmin:     $request->boolean('is_admin', false),
        );
    }
}
