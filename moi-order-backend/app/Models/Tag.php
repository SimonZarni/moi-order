<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — single entity, own domain methods and scopes.
 */
class Tag extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name_my',
        'name_en',
        'name_th',
        'slug',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function places(): BelongsToMany
    {
        return $this->belongsToMany(Place::class, 'place_tag');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->whereNull('deleted_at');
    }
}
