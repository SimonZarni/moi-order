<?php

declare(strict_types=1);

namespace App\Enums;

enum AuditAction: string
{
    case Created       = 'created';
    case Updated       = 'updated';
    case Deleted       = 'deleted';
    case Restored      = 'restored';
    case Login         = 'login';
    case Logout        = 'logout';
    case StatusChanged = 'status_changed';
    case Exported      = 'exported';

    public function label(): string
    {
        return match($this) {
            self::Created       => 'Created',
            self::Updated       => 'Updated',
            self::Deleted       => 'Deleted',
            self::Restored      => 'Restored',
            self::Login         => 'Login',
            self::Logout        => 'Logout',
            self::StatusChanged => 'Status Changed',
            self::Exported      => 'Exported',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::Created       => 'success',
            self::Updated       => 'info',
            self::Deleted       => 'error',
            self::Restored      => 'warning',
            self::Login         => 'default',
            self::Logout        => 'default',
            self::StatusChanged => 'warning',
            self::Exported      => 'default',
        };
    }
}
