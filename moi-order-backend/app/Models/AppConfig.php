<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AppUpdateType;
use Illuminate\Database\Eloquent\Model;

/**
 * Single-row configuration table — stores app update gating settings only.
 * In-app alerts are managed separately in the in_app_alerts table.
 *
 * SRP: This model owns only app-update configuration data.
 * Tell-Don't-Ask: current() guarantees the record exists; callers never check for null.
 *
 * @property int            $id
 * @property string|null    $ios_min_version
 * @property int|null       $ios_min_build
 * @property string|null    $android_min_version
 * @property int|null       $android_min_code
 * @property AppUpdateType  $update_type
 * @property string|null    $update_title
 * @property string|null    $update_message
 * @property string|null    $ios_store_url
 * @property string|null    $android_store_url
 */
class AppConfig extends Model
{
    protected $table = 'app_configs';

    /** @var list<string> */
    protected $fillable = [
        'ios_min_version',
        'ios_min_build',
        'android_min_version',
        'android_min_code',
        'update_type',
        'update_title',
        'update_message',
        'ios_store_url',
        'android_store_url',
        'next_version',
        'changelog',
    ];

    /** @return array<string, mixed> */
    protected function casts(): array
    {
        return [
            'update_type'      => AppUpdateType::class,
            'changelog'        => 'array',
            'ios_min_build'    => 'integer',
            'android_min_code' => 'integer',
        ];
    }

    public static function current(): static
    {
        return static::firstOrCreate([], [
            'update_type' => AppUpdateType::None,
        ]);
    }
}
