<?php

declare(strict_types=1);

namespace App\Enums;

enum SubmissionStatus: string
{
    case Processing = 'processing';
    case Completed  = 'completed';

    public function label(): string
    {
        return match($this) {
            self::Processing => 'Processing',
            self::Completed  => 'Completed',
        };
    }

    public function isTerminal(): bool
    {
        return match($this) {
            self::Processing => false,
            self::Completed  => true,
        };
    }
}
