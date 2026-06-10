<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\UpdateBusinessProfileRequest;

/**
 * Principle: SRP — plain typed value object for business profile update.
 * Principle: DIP — Service receives this DTO, never a FormRequest.
 */
readonly class UpdateBusinessProfileDTO
{
    public function __construct(
        public ?string $businessPhone,
    ) {}

    public static function fromRequest(UpdateBusinessProfileRequest $request): self
    {
        return new self(
            businessPhone: $request->validated('business_phone'),
        );
    }
}
