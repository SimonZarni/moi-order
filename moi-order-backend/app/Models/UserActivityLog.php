<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UserActivityEvent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Append-only record of user-triggered and admin-triggered account events.
 * No updated_at — rows are never modified after insert.
 *
 * @property int                $id
 * @property int                $user_id
 * @property UserActivityEvent  $event
 * @property string             $event_label
 * @property string             $category
 * @property array<string,mixed>|null $metadata
 * @property string|null        $ip_address
 * @property string|null        $user_agent
 * @property \Carbon\Carbon     $created_at
 */
class UserActivityLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'event',
        'event_label',
        'category',
        'metadata',
        'ip_address',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'event'      => UserActivityEvent::class,
        'metadata'   => 'array',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Prevent accidental updates — this model is append-only. */
    public function update(array $attributes = [], array $options = []): bool
    {
        throw new \LogicException('UserActivityLog rows are immutable.');
    }

    /** Prevent hard deletes. */
    public function forceDelete(): bool
    {
        throw new \LogicException('UserActivityLog rows cannot be deleted.');
    }
}
