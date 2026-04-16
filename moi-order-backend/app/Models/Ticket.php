<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — owns the ticket venue record only.
 * Principle: Information Expert — startingFromPrice() lives here because this model
 *   has the variants relationship.
 */
class Ticket extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'highlight_description',
        'description',
        'google_maps_link',
        'address',
        'city',
        'province',
        'cover_image_path',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active'  => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** Minimum active variant price in whole THB for the listing card. */
    public function startingFromPrice(): ?int
    {
        return $this->activeVariants()->min('price');
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function variants(): HasMany
    {
        return $this->hasMany(TicketVariant::class)->orderBy('sort_order');
    }

    public function activeVariants(): HasMany
    {
        return $this->variants()->where('is_active', true);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
