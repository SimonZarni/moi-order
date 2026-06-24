<?php

declare(strict_types=1);

namespace App\Enums;

enum SafetyCategory: string
{
    case Hospital      = 'hospital';
    case PoliceStation = 'police_station';
    case Rescue        = 'rescue';

    public function label(): string
    {
        return match ($this) {
            self::Hospital      => 'Hospital',
            self::PoliceStation => 'Police Station',
            self::Rescue        => 'Rescue',
        };
    }
}
