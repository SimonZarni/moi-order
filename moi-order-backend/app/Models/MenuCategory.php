<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\MenuCategoryType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'restaurant_id',
        'opening_hour_id',
        'name',
        'sort_order',
        'category_type',
    ];

    protected function casts(): array
    {
        return [
            'sort_order'    => 'integer',
            'category_type' => MenuCategoryType::class,
        ];
    }

    public function isSession(): bool
    {
        return $this->opening_hour_id !== null;
    }

    public function isSystem(): bool
    {
        // Session categories are never system categories — merchant can freely edit/delete them.
        return $this->category_type !== null && ! $this->isSession();
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function openingHour(): BelongsTo
    {
        return $this->belongsTo(RestaurantOpeningHour::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('sort_order');
    }

    /** Items from custom categories that were also added to this system category via the pivot. */
    public function linkedItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class, 'menu_item_system_categories')
            ->orderBy('menu_items.sort_order');
    }
}
