<?php

declare(strict_types=1);

namespace App\Enums;

enum MenuItemStatus: string
{
    case Available   = 'available';
    case OutOfStock  = 'out_of_stock';
    case Hidden      = 'hidden';

    public function label(): string
    {
        return match($this) {
            self::Available  => 'Available',
            self::OutOfStock => 'Out of Stock',
            self::Hidden     => 'Hidden',
        };
    }
}
