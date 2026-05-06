<?php

declare(strict_types=1);

namespace App\Enums;

enum EmergencyContactType: string
{
    case Hospital      = 'hospital';
    case PoliceStation = 'police_station';
    case Rescue        = 'rescue';

    public function label(): string
    {
        return match($this) {
            self::Hospital      => 'Hospital',
            self::PoliceStation => 'Police Station',
            self::Rescue        => 'Rescue',
        };
    }

    /** Whether this type shows a map URL / lat-lng fields. */
    public function hasMapCoordinates(): bool
    {
        return match($this) {
            self::Hospital, self::PoliceStation => true,
            self::Rescue                        => false,
        };
    }
}
