<?php

declare(strict_types=1);

namespace App\Enums;

enum HomeCardRouteType: string
{
    case Internal    = 'internal';
    case ExternalUrl = 'external_url';

    public function label(): string
    {
        return match($this) {
            self::Internal    => 'Internal Screen',
            self::ExternalUrl => 'External URL',
        };
    }
}
