<?php

declare(strict_types=1);

namespace App\Enums;

enum EmailOtpPurpose: string
{
    case Registration  = 'registration';
    case PasswordReset = 'password_reset';

    public function label(): string
    {
        return match ($this) {
            self::Registration  => 'Email Verification',
            self::PasswordReset => 'Password Reset',
        };
    }
}
