<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Str;

/**
 * Generates a UUID v4 on the `creating` event and binds route model lookups
 * to the `uuid` column instead of the integer PK.
 *
 * Security: exposes opaque, non-enumerable identifiers on all API routes
 * while keeping efficient integer PKs for all internal FK relationships.
 */
trait HasUuid
{
    public static function bootHasUuid(): void
    {
        static::creating(function (self $model): void {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}
