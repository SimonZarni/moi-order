<?php

declare(strict_types=1);

namespace App\Enums;

enum HomeCardIconKey: string
{
    case Calendar  = 'calendar';
    case Location  = 'location';
    case Flash     = 'flash';
    case Embassy   = 'embassy';
    case Airport   = 'airport';
    case Bus       = 'bus';
    case Passport  = 'passport';
    case Food      = 'food';
    case Ticket    = 'ticket';
    case Company   = 'company';
}
