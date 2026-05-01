<?php

declare(strict_types=1);

namespace App\Enums;

enum HomeCardNavigationScreen: string
{
    case NinetyDayReport   = 'NinetyDayReport';
    case Places            = 'Places';
    case Tickets           = 'Tickets';
    case OtherServices     = 'OtherServices';
    case EmbassyServices   = 'EmbassyServices';
    case AirportFastTrack  = 'AirportFastTrack';
    case Food              = 'Food';
    case PassportVault     = 'PassportVault';
    case Search            = 'Search';
    case PlacesMap         = 'PlacesMap';

    public function label(): string
    {
        return match($this) {
            self::NinetyDayReport  => '90-Day Report',
            self::Places           => 'Places',
            self::Tickets          => 'Tickets',
            self::OtherServices    => 'Other Services',
            self::EmbassyServices  => 'Embassy Services',
            self::AirportFastTrack => 'Airport Fast Track',
            self::Food             => 'Food',
            self::PassportVault    => 'Passport Vault',
            self::Search           => 'Search',
            self::PlacesMap        => 'Places Map',
        };
    }
}
