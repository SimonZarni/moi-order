<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\CreateAdminMerchantRequest;
use Illuminate\Http\UploadedFile;

/**
 * Principle: SRP — plain typed value object for admin-created merchant.
 * Principle: DIP — Service receives this DTO, never a FormRequest.
 * Note: $documentFiles holds UploadedFile instances keyed by KycDocumentType string.
 *   File objects are a necessary exception to the primitives-only DTO rule.
 */
readonly class AdminCreateMerchantDTO
{
    /**
     * @param  array<string, UploadedFile>  $documentFiles
     */
    public function __construct(
        public string  $name,
        public string  $email,
        public string  $password,
        public string  $businessName,
        public string  $businessType,
        public string  $businessAddress,
        public ?string $businessPhone,
        public array   $documentFiles,
    ) {}

    public static function fromRequest(CreateAdminMerchantRequest $request): self
    {
        $documentFiles = [];

        foreach (['national_id', 'business_registration', 'bank_book', 'storefront_photo'] as $type) {
            $file = $request->file("documents.{$type}");
            if ($file instanceof UploadedFile) {
                $documentFiles[$type] = $file;
            }
        }

        return new self(
            name:            $request->validated('name'),
            email:           $request->validated('email'),
            password:        $request->validated('password'),
            businessName:    $request->validated('business_name'),
            businessType:    $request->validated('business_type'),
            businessAddress: $request->validated('business_address'),
            businessPhone:   $request->validated('business_phone'),
            documentFiles:   $documentFiles,
        );
    }
}
