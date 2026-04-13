<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentStatus: string
{
    case Pending   = 'pending';
    case Succeeded = 'succeeded';
    case Failed    = 'failed';

    public function label(): string
    {
        return match($this) {
            self::Pending   => 'Pending',
            self::Succeeded => 'Succeeded',
            self::Failed    => 'Failed',
        };
    }

    public function isTerminal(): bool
    {
        return match($this) {
            self::Pending   => false,
            self::Succeeded => true,
            self::Failed    => true,
        };
    }
}
