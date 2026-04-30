<?php

declare(strict_types=1);

namespace App\Enums;

enum FoodOrderStatus: string
{
    case Pending   = 'pending';
    case Confirmed = 'confirmed';
    case Ready     = 'ready';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match($this) {
            self::Pending   => 'Pending',
            self::Confirmed => 'Confirmed',
            self::Ready     => 'Ready',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
        };
    }

    public function isTerminal(): bool
    {
        return in_array($this, [self::Completed, self::Cancelled], true);
    }

    /** @return list<self> */
    public function allowedTransitions(): array
    {
        return match($this) {
            self::Pending   => [self::Confirmed, self::Cancelled],
            self::Confirmed => [self::Ready, self::Cancelled],
            self::Ready     => [self::Completed],
            self::Completed,
            self::Cancelled => [],
        };
    }

    public function canTransitionTo(self $next): bool
    {
        return in_array($next, $this->allowedTransitions(), true);
    }
}
