<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FoodOrderItem extends Model
{
    protected $fillable = [
        'food_order_id',
        'menu_item_id',
        'name',
        'price_cents',
        'quantity',
        'notes',
        'subtotal_cents',
    ];

    protected function casts(): array
    {
        return [
            'price_cents'    => 'integer',
            'quantity'       => 'integer',
            'subtotal_cents' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(FoodOrder::class, 'food_order_id');
    }

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }
}
