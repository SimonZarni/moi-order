<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Merchant\CreateKycApplicationRequest;

/**
 * Principle: SRP — plain typed value object for KYC application data.
 * Principle: DIP — Service receives this DTO, never a FormRequest.
 */
readonly class KycApplicationDTO
{
    public function __construct(
        public string $businessName,
        public string $businessType,
        public string $businessAddress,
        public ?string $businessPhone,
    ) {}

    public static function fromRequest(CreateKycApplicationRequest $request): self
    {
        return new self(
            businessName:    $request->validated('business_name'),
            businessType:    $request->validated('business_type'),
            businessAddress: $request->validated('business_address'),
            businessPhone:   $request->validated('business_phone'),
        );
    }
}
