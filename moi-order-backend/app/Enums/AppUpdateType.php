<?php

declare(strict_types=1);

namespace App\Enums;

enum AppUpdateType: string
{
    case None     = 'none';
    case Optional = 'optional';
    case Required = 'required';

    public function label(): string
    {
        return match($this) {
            self::None     => 'No Update',
            self::Optional => 'Optional Update',
            self::Required => 'Required Update',
        };
    }

    public function isForced(): bool
    {
        return $this === self::Required;
    }
}
