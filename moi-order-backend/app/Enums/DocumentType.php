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
    case UpperBodyPhoto     = 'upper_body_photo';
    case AirplaneTicket     = 'airplane_ticket';
    case PassportSizePhoto  = 'passport_size_photo';
    case TestPhoto          = 'test_photo';

    public function label(): string
    {
        return match($this) {
            self::PassportBioPage   => 'Passport Bio Page',
            self::VisaPage          => 'Visa Page',
            self::OldSlip           => 'Old 90-Day Report Slip',
            self::IdentityCardFront => 'Identity Card (Front)',
            self::IdentityCardBack  => 'Identity Card (Back)',
            self::Tm30              => 'TM30',
            self::UpperBodyPhoto    => 'Upper Half Body Photo',
            self::AirplaneTicket    => 'Airplane Ticket',
            self::PassportSizePhoto => 'Passport Size Photo',
            self::TestPhoto         => 'Test Photo',
        };
    }

    public function labelMm(): string
    {
        return match($this) {
            self::PassportBioPage   => 'ပတ်စပို့ (ရှေ့မျက်နှာ)',
            self::VisaPage          => 'ဗီဇာ မျက်နှာ',
            self::OldSlip           => 'ရက် ၉၀ စလစ်အဟောင်း',
            self::IdentityCardFront => 'မှတ်ပုံတင် (အရှေ့)',
            self::IdentityCardBack  => 'မှတ်ပုံတင် (အနောက်)',
            self::Tm30              => 'TM30',
            self::UpperBodyPhoto    => 'ကိုယ်တစ်ပိုင်းပုံ (လာမည့်နေ့ ဝတ်ဆင်လာမည့် ပုံစံ)',
            self::AirplaneTicket    => 'လေယာဉ်လက်မှတ်',
            self::PassportSizePhoto => 'ပတ်စပို့ ဓါတ်ပုံ (1.5" x 1.5")',
            self::TestPhoto         => 'Test Photo',
        };
    }
}
