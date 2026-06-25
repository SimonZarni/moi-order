<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminUpdateUserRequest;

readonly class AdminUpdateUserDTO
{
    public function __construct(
        public ?string $name,
        public ?string $email,
        public ?string $phoneNumber,
        public bool    $phoneNumberSent,
        public ?string $password,
        public ?string $dateOfBirth,
    ) {}

    public static function fromRequest(AdminUpdateUserRequest $request): self
    {
        return new self(
            name:             $request->has('name')          ? $request->string('name')->toString()                                        : null,
            email:            $request->has('email')         ? ($request->filled('email') ? $request->string('email')->lower()->toString() : null) : null,
            phoneNumber:      $request->filled('phone_number') ? $request->string('phone_number')->toString() : null,
            phoneNumberSent:  $request->has('phone_number'),
            password:         $request->has('password')      ? ($request->filled('password') ? $request->string('password')->toString()    : null) : null,
            dateOfBirth:      $request->has('date_of_birth') ? $request->input('date_of_birth')                                            : null,
        );
    }
}
