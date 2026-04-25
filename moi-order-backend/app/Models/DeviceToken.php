<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: SRP — owns device push token persistence only.
 * No soft deletes: device tokens are technical records, not business entities.
 *
 * @property int    $id
 * @property int    $user_id
 * @property string $token
 * @property string $platform
 */
class DeviceToken extends Model
{
    protected $fillable = ['user_id', 'token', 'platform'];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeForUser(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }
}
