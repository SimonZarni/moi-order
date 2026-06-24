<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\SafetyCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SafetyLocation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'phone',
        'location',
        'fb_page_link',
        'gmap_link',
        'description',
        'latitude',
        'longitude',
        'photo_paths',
        'cover_photo_path',
    ];

    protected function casts(): array
    {
        return [
            'category'    => SafetyCategory::class,
            'latitude'    => 'float',
            'longitude'   => 'float',
            'photo_paths' => 'array',
        ];
    }

    public function scopeByCategory(\Illuminate\Database\Eloquent\Builder $query, SafetyCategory $category): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('category', $category->value);
    }
}
