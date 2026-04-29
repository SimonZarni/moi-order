<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\UpdateProfileRequest;

readonly class UpdateProfileDTO
{
    public function __construct(
        public string  $name,
        public string  $email,
        public ?string $phoneNumber,
        public ?string $dateOfBirth,
    ) {}

    public static function fromRequest(UpdateProfileRequest $request): self
    {
        return new self(
            name:         $request->string('name')->toString(),
            email:        $request->string('email')->toString(),
            phoneNumber:  $request->filled('phone_number') ? $request->string('phone_number')->toString() : null,
            dateOfBirth:  $request->input('date_of_birth'),
        );
    }
}
