<?php

declare(strict_types=1);

namespace App\Enums;

enum MenuItemStatus: string
{
    case Available   = 'available';
    case Unavailable = 'unavailable';

    public function label(): string
    {
        return match($this) {
            self::Available   => 'Available',
            self::Unavailable => 'Unavailable',
        };
    }
}
