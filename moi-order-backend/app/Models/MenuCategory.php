<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\MenuCategoryType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'restaurant_id',
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

    public function isSystem(): bool
    {
        return $this->category_type !== null;
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('sort_order');
    }
}
