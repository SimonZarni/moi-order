<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EmergencyContactType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmergencyContact extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'type',
        'title_en',
        'title_mm',
        'title_th',
        'description_en',
        'description_mm',
        'description_th',
        'phone',
        'map_url',
        'latitude',
        'longitude',
        'location',
        'facebook_url',
        'website_url',
        'is_active',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'type'      => EmergencyContactType::class,
            'latitude'  => 'float',
            'longitude' => 'float',
            'is_active' => 'boolean',
            'position'  => 'integer',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function photos(): HasMany
    {
        return $this->hasMany(EmergencyContactPhoto::class)->orderBy('position');
    }

    /** Single cover photo (lowest position). For list endpoints. */
    public function coverPhoto(): HasOne
    {
        return $this->hasOne(EmergencyContactPhoto::class)->orderBy('position');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOfType(\Illuminate\Database\Eloquent\Builder $query, EmergencyContactType $type): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('type', $type->value);
    }
}
