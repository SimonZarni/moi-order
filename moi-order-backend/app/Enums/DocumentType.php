<?php

declare(strict_types=1);

namespace App\Enums;

enum DocumentType: string
{
    case PassportBioPage    = 'passport_bio_page';
    case VisaPage           = 'visa_page';
    case OldSlip            = 'old_slip';
    case IdentityCardFront  = 'identity_card_front';
    case IdentityCardBack   = 'identity_card_back';
    case Tm30               = 'tm30';

    public function label(): string
    {
        return match($this) {
            self::PassportBioPage   => 'Passport Bio Page',
            self::VisaPage          => 'Visa Page',
            self::OldSlip           => 'Old 90-Day Report Slip',
            self::IdentityCardFront => 'Identity Card (Front)',
            self::IdentityCardBack  => 'Identity Card (Back)',
            self::Tm30              => 'TM30',
        };
    }
}
