<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class RestaurantOpeningHour extends Model
{
    protected $fillable = [
        'restaurant_id',
        'day_of_week',
        'sort_order',
        'opens_at',
        'closes_at',
        'is_closed',
        'session_menu_enabled',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week'          => 'integer',
            'sort_order'           => 'integer',
            'is_closed'            => 'boolean',
            'session_menu_enabled' => 'boolean',
        ];
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function sessionMenuCategories(): HasMany
    {
        return $this->hasMany(MenuCategory::class, 'opening_hour_id')->orderBy('sort_order');
    }

    /** All menu items in every session category for this slot. */
    public function sessionMenuItems(): HasManyThrough
    {
        return $this->hasManyThrough(
            MenuItem::class,
            MenuCategory::class,
            'opening_hour_id',  // FK on MenuCategory → RestaurantOpeningHour
            'menu_category_id', // FK on MenuItem → MenuCategory
            'id',
            'id',
        );
    }
}
