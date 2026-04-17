<?php

declare(strict_types=1);

namespace App\Enums;

enum FieldType: string
{
    case Text     = 'text';
    case Textarea = 'textarea';
    case Number   = 'number';
    case Email    = 'email';
    case Phone    = 'phone';
    case Date     = 'date';
    case Boolean  = 'boolean';
    case Select   = 'select';
    case File     = 'file';

    public function requiresOptions(): bool
    {
        return $this === self::Select;
    }

    public function requiresAccepts(): bool
    {
        return $this === self::File;
    }
}
