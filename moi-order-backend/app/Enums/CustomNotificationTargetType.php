<?php

declare(strict_types=1);

namespace App\Enums;

enum CustomNotificationTargetType: string
{
    case All    = 'all';
    case Single = 'single';

    public function label(): string
    {
        return match ($this) {
            self::All    => 'All Users',
            self::Single => 'Single User',
        };
    }
}
