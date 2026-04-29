<?php

declare(strict_types=1);

namespace App\Enums;

enum DocumentType: string
{
    case Passport        = 'passport';
    case NinetyDayReport = 'ninety_day_report';
    case Other           = 'other';

    public function label(): string
    {
        return match($this) {
            self::Passport        => 'Passport',
            self::NinetyDayReport => '90-Day Report',
            self::Other           => 'Other Document',
        };
    }

    /** Subtypes accepted for this document category */
    public function acceptedSubtypes(): array
    {
        return match($this) {
            self::Passport        => ['bio_page', 'visa_page'],
            self::NinetyDayReport => ['ninety_day_slip'],
            self::Other           => [],  // any subtype accepted
        };
    }
}
