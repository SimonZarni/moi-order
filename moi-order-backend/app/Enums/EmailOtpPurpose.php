<?php

declare(strict_types=1);

namespace App\Enums;

enum EmailOtpPurpose: string
{
    case Registration        = 'registration';
    case PasswordReset       = 'password_reset';
    case EmailUpdate         = 'email_update';
    case AdminInvite         = 'admin_invite';
    case AccountVerification = 'account_verification';

    public function label(): string
    {
        return match ($this) {
            self::Registration        => 'Email Verification',
            self::PasswordReset       => 'Password Reset',
            self::EmailUpdate         => 'Email Update',
            self::AdminInvite         => 'Admin Account Creation',
            self::AccountVerification => 'Account Verification',
        };
    }
}
