<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PaymentMode;
use Illuminate\Database\Eloquent\Model;

/**
 * Principle: SRP — owns all key-value application settings.
 * Principle: Information Expert — static helpers keep setting reads/writes co-located.
 */
class AppSetting extends Model
{
    protected $primaryKey = 'key';
    public    $incrementing = false;
    protected $keyType      = 'string';

    protected $fillable = ['key', 'value'];

    public static function get(string $key, mixed $default = null): mixed
    {
        $row = static::find($key);
        return $row !== null ? $row->value : $default;
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => (string) $value]);
    }

    public static function isAutoPaymentEnabled(): bool
    {
        return (bool) static::get('auto_payment_enabled', '1');
    }

    // ─── Payment mode ─────────────────────────────────────────────────────────

    public static function getPaymentMode(): PaymentMode
    {
        $raw = static::get('payment_mode', PaymentMode::Stripe->value);
        return PaymentMode::tryFrom((string) $raw) ?? PaymentMode::Stripe;
    }

    public static function setPaymentMode(PaymentMode $mode): void
    {
        static::set('payment_mode', $mode->value);
    }

    // ─── PromptPay QR settings ────────────────────────────────────────────────

    public static function getPromptPayQrImageUrl(): ?string
    {
        $value = static::get('promptpay_qr_image_url');
        return $value !== null && $value !== '' ? (string) $value : null;
    }

    public static function setPromptPayQrImageUrl(?string $url): void
    {
        static::set('promptpay_qr_image_url', $url ?? '');
    }

    public static function getPromptPayBankName(): ?string
    {
        $value = static::get('promptpay_bank_name');
        return $value !== null && $value !== '' ? (string) $value : null;
    }

    public static function getPromptPayBankAccountNumber(): ?string
    {
        $value = static::get('promptpay_bank_account_number');
        return $value !== null && $value !== '' ? (string) $value : null;
    }

    public static function getPromptPayBankAccountName(): ?string
    {
        $value = static::get('promptpay_bank_account_name');
        return $value !== null && $value !== '' ? (string) $value : null;
    }

    public static function setPromptPayBankInfo(
        ?string $bankName,
        ?string $accountNumber,
        ?string $accountName,
    ): void {
        static::set('promptpay_bank_name', $bankName ?? '');
        static::set('promptpay_bank_account_number', $accountNumber ?? '');
        static::set('promptpay_bank_account_name', $accountName ?? '');
    }

    // ─── Alarm sound ──────────────────────────────────────────────────────────

    public static function getAlarmSoundPath(): ?string
    {
        $value = static::get('alarm_sound_path');
        return $value !== null && $value !== '' ? (string) $value : null;
    }

    public static function setAlarmSoundPath(?string $path): void
    {
        static::set('alarm_sound_path', $path ?? '');
    }
}
