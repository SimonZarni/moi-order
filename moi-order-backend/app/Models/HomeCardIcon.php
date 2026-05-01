<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\HomeCardIconType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomeCardIcon extends Model
{
    use SoftDeletes;

    protected $fillable = ['key', 'label', 'type', 'image_path', 'is_active'];

    protected $casts = [
        'type'      => HomeCardIconType::class,
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
