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
        // null = not submitted (leave DB value untouched); string = set; '' after trim = clear
        public ?string $lineHandle,
        public bool    $lineHandleSubmitted,
    ) {}

    public static function fromRequest(UpdateProfileRequest $request): self
    {
        $submitted = $request->has('line_handle');

        return new self(
            name:                $request->string('name')->toString(),
            email:               $request->string('email')->toString(),
            phoneNumber:         $request->filled('phone_number') ? $request->string('phone_number')->toString() : null,
            dateOfBirth:         $request->input('date_of_birth'),
            lineHandle:          $submitted && $request->filled('line_handle')
                                     ? $request->string('line_handle')->toString()
                                     : null,
            lineHandleSubmitted: $submitted,
        );
    }
}
