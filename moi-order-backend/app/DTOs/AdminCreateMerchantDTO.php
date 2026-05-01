<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\CreateAdminMerchantRequest;

/**
 * Principle: SRP — plain typed value object for admin-created merchant.
 * Principle: DIP — Service receives this DTO, never a FormRequest.
 */
readonly class AdminCreateMerchantDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public string $businessName,
        public string $businessType,
        public string $businessAddress,
    ) {}

    public static function fromRequest(CreateAdminMerchantRequest $request): self
    {
        return new self(
            name:            $request->validated('name'),
            email:           $request->validated('email'),
            password:        $request->validated('password'),
            businessName:    $request->validated('business_name'),
            businessType:    $request->validated('business_type'),
            businessAddress: $request->validated('business_address'),
        );
    }
}
