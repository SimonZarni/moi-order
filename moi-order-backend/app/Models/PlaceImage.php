<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: SRP — single entity representing one image in a place gallery.
 */
class PlaceImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'place_id',
        'path',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function place(): BelongsTo
    {
        return $this->belongsTo(Place::class);
    }
}
