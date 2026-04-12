<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\UpdateProfileRequest;

readonly class UpdateProfileDTO
{
    public function __construct(
        public string  $name,
        public ?string $dateOfBirth,
    ) {}

    public static function fromRequest(UpdateProfileRequest $request): self
    {
        return new self(
            name:         $request->string('name')->toString(),
            dateOfBirth:  $request->input('date_of_birth'),
        );
    }
}
