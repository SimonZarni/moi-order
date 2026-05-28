<?php

declare(strict_types=1);

namespace App\Enums;

enum AddressLabel: string
{
    case Home  = 'home';
    case Work  = 'work';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Home  => 'Home',
            self::Work  => 'Work',
            self::Other => 'Other',
        };
    }
}
