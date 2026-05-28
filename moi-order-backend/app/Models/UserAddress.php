<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AddressLabel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAddress extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'label',
        'address',
        'building',
        'floor',
        'landmark',
        'latitude',
        'longitude',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'label'      => AddressLabel::class,
            'latitude'   => 'float',
            'longitude'  => 'float',
            'is_default' => 'boolean',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** Formatted one-line summary for display and order snapshots. */
    public function formatted(): string
    {
        $parts = array_filter([
            $this->address,
            $this->building,
            $this->floor,
            $this->landmark,
        ]);

        return implode(', ', $parts);
    }

    /** Sets this address as default and clears previous default — must be called inside a transaction. */
    public function setAsDefault(): void
    {
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeForUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
