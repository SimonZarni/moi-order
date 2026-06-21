<?php

declare(strict_types=1);

namespace App\Enums;

enum DailyInvoiceStatus: string
{
    case Pending = 'pending';
    case Paid    = 'paid';

    public function label(): string
    {
        return match($this) {
            self::Pending => 'Pending',
            self::Paid    => 'Paid',
        };
    }

    public function isTerminal(): bool
    {
        return $this === self::Paid;
    }
}
