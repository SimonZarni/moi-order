<?php

declare(strict_types=1);

namespace App\Enums;

enum RestaurantStatus: string
{
    case Open   = 'open';
    case Closed = 'closed';
    case Paused = 'paused';

    public function label(): string
    {
        return match($this) {
            self::Open   => 'Open',
            self::Closed => 'Closed',
            self::Paused => 'Paused — not accepting orders',
        };
    }

    public function isAcceptingOrders(): bool
    {
        return $this === self::Open;
    }
}
