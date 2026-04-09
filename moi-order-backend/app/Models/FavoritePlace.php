<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: SRP — pivot entity for user-favourited places.
 * Kept as an explicit Model (not just a pivot) so the API can
 * return a favourite ID for deletion without requiring both FKs.
 */
class FavoritePlace extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'place_id',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
