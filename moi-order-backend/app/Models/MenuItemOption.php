<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuItemOption extends Model
{
    protected $fillable = [
        'option_group_id',
        'name',
        'additional_price_cents',
        'is_available',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'additional_price_cents' => 'integer',
            'is_available'           => 'boolean',
            'sort_order'             => 'integer',
        ];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(MenuItemOptionGroup::class, 'option_group_id');
    }
}
