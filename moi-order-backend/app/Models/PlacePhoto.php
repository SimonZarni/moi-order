<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: SRP — represents one Google-sourced photo in the admin staging table.
 * Not soft-deleted (no PII, purely operational). Cascade-deleted when the Place is deleted.
 */
class PlacePhoto extends Model
{
    protected $fillable = [
        'place_id',
        'photo_url',
        'google_photo_name',
        'display_order',
        'is_selected',
        'source',
        'width_px',
        'height_px',
        'author_name',
    ];

    protected function casts(): array
    {
        return [
            'display_order' => 'integer',
            'is_selected'   => 'boolean',
            'width_px'      => 'integer',
            'height_px'     => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
