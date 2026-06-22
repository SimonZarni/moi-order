<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\MenuItemStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'menu_category_id',
        'restaurant_id',
        'name',
        'description',
        'price_cents',
        'original_price_cents',
        'photo_path',
        'status',
        'sort_order',
    ];

    protected $hidden = ['photo_path'];

    protected function casts(): array
    {
        return [
            'price_cents'          => 'integer',
            'original_price_cents' => 'integer',
            'sort_order'           => 'integer',
            'status'               => MenuItemStatus::class,
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    public function isAvailable(): bool
    {
        return $this->status === MenuItemStatus::Available;
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeAvailable(\Illuminate\Database\Eloquent\Builder $query): void
    {
        $query->where('status', MenuItemStatus::Available->value);
    }

    /** Excludes only Hidden items — OutOfStock items are shown dimmed to customers. */
    public function scopeVisibleToCustomer(\Illuminate\Database\Eloquent\Builder $query): void
    {
        $query->whereIn('status', [MenuItemStatus::Available->value, MenuItemStatus::OutOfStock->value]);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(MenuCategory::class, 'menu_category_id');
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function optionGroups(): HasMany
    {
        return $this->hasMany(MenuItemOptionGroup::class)->orderBy('sort_order');
    }
}
