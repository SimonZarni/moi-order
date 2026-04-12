<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — single entity with own domain methods and scopes.
 * Principle: Encapsulation — relationships expressed via typed methods.
 * Principle: Tell-Don't-Ask — domain behaviour lives on the model.
 */
class Place extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name_my',
        'name_en',
        'name_th',
        'short_description',
        'long_description',
        'address',
        'city',
        'latitude',
        'longitude',
        'opening_hours',
        'contact_phone',
        'website',
        'google_map_url',
    ];

    protected function casts(): array
    {
        return [
            'latitude'  => 'float',
            'longitude' => 'float',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'place_tag');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PlaceImage::class)->orderBy('sort_order');
    }

    /**
     * The single cover image (lowest sort_order).
     * Used by the list endpoint so we load 1 row per place instead of all images.
     */
    public function coverImage(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(PlaceImage::class)->orderBy('sort_order');
    }

    public function favoritedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorite_places')->withTimestamps();
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->whereNull('deleted_at');
    }

    public function scopeInCity(\Illuminate\Database\Eloquent\Builder $query, string $city): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('city', $city);
    }

    public function scopeForCategory(\Illuminate\Database\Eloquent\Builder $query, int $categoryId): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('category_id', $categoryId);
    }
}
