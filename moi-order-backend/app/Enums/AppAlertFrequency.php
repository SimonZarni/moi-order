<?php

declare(strict_types=1);

namespace App\Enums;

enum AppAlertFrequency: string
{
    case OncePerDay = 'once_per_day';
    case EveryOpen  = 'every_open';

    public function label(): string
    {
        return match($this) {
            self::OncePerDay => 'Once per day',
            self::EveryOpen  => 'Every app open',
        };
    }
}
