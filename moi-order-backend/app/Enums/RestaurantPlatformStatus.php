<?php

declare(strict_types=1);

namespace App\Enums;

enum RestaurantPlatformStatus: string
{
    case Active    = 'active';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match($this) {
            self::Active    => 'Active',
            self::Suspended => 'Suspended',
        };
    }

    public function isActive(): bool
    {
        return $this === self::Active;
    }
}
