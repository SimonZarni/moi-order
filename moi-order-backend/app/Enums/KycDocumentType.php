<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Principle: SRP — owns document type labels and required-status check.
 * All four types are required before submission; isRequired() is a domain rule.
 */
enum KycDocumentType: string
{
    case NationalId            = 'national_id';
    case BusinessRegistration  = 'business_registration';
    case BankBook              = 'bank_book';
    case StorefrontPhoto       = 'storefront_photo';

    public function label(): string
    {
        return match ($this) {
            self::NationalId           => 'National ID / Passport',
            self::BusinessRegistration => 'Business Registration Certificate',
            self::BankBook             => 'Bank Book / Bank Account Evidence',
            self::StorefrontPhoto      => 'Storefront Photo',
        };
    }

    /** All document types are mandatory for KYC submission. */
    public function isRequired(): bool
    {
        return true;
    }
}
