<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\ServiceTypeFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — owns service subtype entity (name + price) for one service.
 * Principle: Information Expert — price lives here; snapshots taken at submission time.
 */
class ServiceType extends Model
{
    /** @use HasFactory<ServiceTypeFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_id',
        'name',
        'name_en',
        'price',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price'     => 'integer',
            'is_active' => 'boolean',
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ServiceSubmission::class);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }
}
