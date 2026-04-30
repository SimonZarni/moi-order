<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RestaurantPhoto extends Model
{
    protected $fillable = [
        'restaurant_id',
        'file_path',
        'sort_order',
    ];

    protected $hidden = ['file_path'];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }
}
