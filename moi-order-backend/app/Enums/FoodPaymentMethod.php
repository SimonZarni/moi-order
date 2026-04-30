<?php

declare(strict_types=1);

namespace App\Enums;

enum FoodPaymentMethod: string
{
    case Cod     = 'cod';
    case LinePay = 'line_pay';

    public function label(): string
    {
        return match($this) {
            self::Cod     => 'Cash on Delivery',
            self::LinePay => 'LINE Pay',
        };
    }
}
