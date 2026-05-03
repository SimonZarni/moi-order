<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case Regular    = 'regular';
    case Privileged = 'privileged';

    public function label(): string
    {
        return match ($this) {
            self::Regular    => 'Regular',
            self::Privileged => 'Privileged',
        };
    }

    public function isPrivileged(): bool
    {
        return $this === self::Privileged;
    }
}
