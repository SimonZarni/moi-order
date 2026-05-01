<?php

declare(strict_types=1);

namespace App\Enums;

enum HomeCardIconType: string
{
    case Builtin = 'builtin';
    case Custom  = 'custom';
}
