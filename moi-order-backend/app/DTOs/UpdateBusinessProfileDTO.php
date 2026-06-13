<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\UpdateBusinessProfileRequest;

/**
 * Principle: SRP — plain typed value object for business profile update.
 * Principle: DIP — Service receives this DTO, never a FormRequest.
 *
 * has* flags distinguish "field not sent" from "field explicitly set to null/value",
 * allowing partial updates without accidentally clearing unrelated fields.
 */
readonly class UpdateBusinessProfileDTO
{
    public function __construct(
        public bool    $hasBusinessPhone,
        public ?string $businessPhone,
        public bool    $hasEmail,
        public ?string $email,
    ) {}

    public static function fromRequest(UpdateBusinessProfileRequest $request): self
    {
        return new self(
            hasBusinessPhone: $request->has('business_phone'),
            businessPhone:    $request->validated('business_phone'),
            hasEmail:         $request->has('email'),
            email:            $request->has('email') ? (string) $request->validated('email') : null,
        );
    }
}
