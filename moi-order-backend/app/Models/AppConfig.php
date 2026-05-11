<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AppAlertFrequency;
use App\Enums\AppUpdateType;
use Illuminate\Database\Eloquent\Model;

/**
 * Single-row configuration table — one record stores all app update and in-app alert settings.
 *
 * SRP: This model owns only app-wide configuration data (no user state).
 * Tell-Don't-Ask: current() guarantees the record exists; callers never check for null.
 *
 * @property int                $id
 * @property string|null        $ios_min_version
 * @property string|null        $android_min_version
 * @property AppUpdateType      $update_type
 * @property string|null        $update_title
 * @property string|null        $update_message
 * @property string|null        $ios_store_url
 * @property string|null        $android_store_url
 * @property bool               $alert_is_active
 * @property string|null        $alert_title
 * @property string|null        $alert_message
 * @property AppAlertFrequency  $alert_frequency
 */
class AppConfig extends Model
{
    protected $table = 'app_configs';

    /** @var list<string> */
    protected $fillable = [
        'ios_min_version',
        'android_min_version',
        'update_type',
        'update_title',
        'update_message',
        'ios_store_url',
        'android_store_url',
        'alert_is_active',
        'alert_title',
        'alert_message',
        'alert_frequency',
    ];

    /** @return array<string, mixed> */
    protected function casts(): array
    {
        return [
            'update_type'    => AppUpdateType::class,
            'alert_frequency' => AppAlertFrequency::class,
            'alert_is_active' => 'boolean',
        ];
    }

    /**
     * Retrieve or seed the single app config row.
     * Uses firstOrCreate so concurrent requests don't create duplicates.
     */
    public static function current(): static
    {
        return static::firstOrCreate([], [
            'update_type'    => AppUpdateType::None,
            'alert_frequency' => AppAlertFrequency::OncePerDay,
            'alert_is_active' => false,
        ]);
    }
}
