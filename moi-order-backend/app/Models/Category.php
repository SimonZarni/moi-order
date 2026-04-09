<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — single entity, own domain methods and scopes.
 * Principle: Encapsulation — state changes via domain methods only.
 */
class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name_my',
        'name_en',
        'name_th',
        'slug',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function places(): HasMany
    {
        return $this->hasMany(Place::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->whereNull('deleted_at');
    }
}
