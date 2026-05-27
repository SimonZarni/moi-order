<?php

declare(strict_types=1);

namespace App\Enums;

enum UserActivityEvent: string
{
    // ── Auth ──────────────────────────────────────────────────────────────────
    case LoginSuccess = 'login_success';
    case LoginFailed  = 'login_failed';

    // ── Password ──────────────────────────────────────────────────────────────
    case PasswordChanged = 'password_changed';

    // ── Social providers ──────────────────────────────────────────────────────
    case GoogleLinked   = 'google_linked';
    case GoogleUnlinked = 'google_unlinked';
    case AppleLinked    = 'apple_linked';
    case AppleUnlinked  = 'apple_unlinked';
    case LineLinked     = 'line_linked';
    case LineUnlinked   = 'line_unlinked';

    // ── Contact info ──────────────────────────────────────────────────────────
    case EmailChanged = 'email_changed';
    case PhoneChanged = 'phone_changed';

    // ── Admin-triggered account actions ───────────────────────────────────────
    case AccountBanned    = 'account_banned';
    case AccountSuspended = 'account_suspended';
    case AccountActivated = 'account_activated';
    case AccountDeleted   = 'account_deleted';

    public function label(): string
    {
        return match ($this) {
            self::LoginSuccess    => 'Login',
            self::LoginFailed     => 'Login failed',
            self::PasswordChanged => 'Password changed',
            self::GoogleLinked    => 'Google account connected',
            self::GoogleUnlinked  => 'Google account disconnected',
            self::AppleLinked     => 'Apple ID connected',
            self::AppleUnlinked   => 'Apple ID disconnected',
            self::LineLinked      => 'LINE account connected',
            self::LineUnlinked    => 'LINE account disconnected',
            self::EmailChanged    => 'Email address changed',
            self::PhoneChanged    => 'Phone number changed',
            self::AccountBanned   => 'Account banned',
            self::AccountSuspended => 'Account suspended',
            self::AccountActivated => 'Account activated',
            self::AccountDeleted  => 'Account deleted',
        };
    }

    /** Groups events for the admin timeline filter chips. */
    public function category(): string
    {
        return match ($this) {
            self::LoginSuccess,
            self::LoginFailed     => 'auth',

            self::PasswordChanged => 'security',

            self::GoogleLinked,
            self::GoogleUnlinked,
            self::AppleLinked,
            self::AppleUnlinked,
            self::LineLinked,
            self::LineUnlinked,
            self::EmailChanged,
            self::PhoneChanged    => 'social',

            self::AccountBanned,
            self::AccountSuspended,
            self::AccountActivated,
            self::AccountDeleted  => 'account',
        };
    }
}
