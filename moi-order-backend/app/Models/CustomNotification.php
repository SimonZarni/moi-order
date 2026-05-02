<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CustomNotificationTargetType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: SRP — persists the custom notification send history only.
 * Immutable after creation: no update domain methods needed.
 */
class CustomNotification extends Model
{
    protected $fillable = [
        'title',
        'body',
        'target_type',
        'target_user_id',
        'created_by',
        'recipients_count',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'target_type'      => CustomNotificationTargetType::class,
            'recipients_count' => 'integer',
            'sent_at'          => 'datetime',
        ];
    }

    public function targetUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
