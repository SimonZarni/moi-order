<?php

declare(strict_types=1);

namespace App\Models;

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
}
