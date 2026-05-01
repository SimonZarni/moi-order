<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\HomeCardRouteType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HomeCardRoute extends Model
{
    use SoftDeletes;

    protected $fillable = ['key', 'label_en', 'label_mm', 'type', 'url', 'is_active'];

    protected $casts = [
        'type'      => HomeCardRouteType::class,
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
