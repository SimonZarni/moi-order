<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItemOptionGroup extends Model
{
    protected $fillable = [
        'menu_item_id',
        'name',
        'is_required',
        'min_selections',
        'max_selections',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_required'    => 'boolean',
            'min_selections' => 'integer',
            'max_selections' => 'integer',
            'sort_order'     => 'integer',
        ];
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(MenuItemOption::class, 'option_group_id')->orderBy('sort_order');
    }
}
