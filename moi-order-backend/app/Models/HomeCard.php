<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomeCard extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'parent_id',
        'slug',
        'position',
        'title_en',
        'title_mm',
        'subtitle_en',
        'subtitle_mm',
        'tag_en',
        'tag_mm',
        'accent_color',
        'icon_key',
        'navigation_screen',
        'navigation_params',
        'is_active',
        'is_coming_soon',
    ];

    protected $casts = [
        'parent_id'         => 'integer',
        'navigation_params' => 'array',
        'is_active'         => 'boolean',
        'is_coming_soon'    => 'boolean',
        'position'          => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(HomeCard::class, 'parent_id');
    }

    /** Active children ordered by their display position within the group. */
    public function children(): HasMany
    {
        return $this->hasMany(HomeCard::class, 'parent_id')
            ->where('is_active', true)
            ->orderBy('position');
    }

    public function icon(): BelongsTo
    {
        return $this->belongsTo(HomeCardIcon::class, 'icon_key', 'key');
    }

    public function route(): BelongsTo
    {
        return $this->belongsTo(HomeCardRoute::class, 'navigation_screen', 'key');
    }

    /** Root cards shown to users: active, no parent, ordered by position. */
    public function scopeVisible($query)
    {
        return $query
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('position');
    }
}
