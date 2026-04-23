<?php

declare(strict_types=1);

namespace App\Enums;

enum UserStatusEnum: string
{
    case Active    = 'active';
    case Suspended = 'suspended';
    case Banned    = 'banned';

    public function label(): string
    {
        return match ($this) {
            self::Active    => 'Active',
            self::Suspended => 'Suspended',
            self::Banned    => 'Banned',
        };
    }

    /** Any non-active status blocks login and API access. */
    public function isRestricted(): bool
    {
        return $this !== self::Active;
    }
}
