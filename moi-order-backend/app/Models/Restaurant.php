<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\RestaurantStatus;
use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Restaurant extends Model
{
    use HasAuditLog, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'address',
        'latitude',
        'longitude',
        'phone',
        'cover_photo_path',
        'logo_path',
        'status',
        'delivery_radius_km',
        'is_delivery_available',
        'is_pickup_available',
        'min_order_cents',
    ];

    protected $hidden = [
        'cover_photo_path',
        'logo_path',
    ];

    protected function casts(): array
    {
        return [
            'status'                => RestaurantStatus::class,
            'latitude'              => 'float',
            'longitude'             => 'float',
            'delivery_radius_km'    => 'float',
            'is_delivery_available' => 'boolean',
            'is_pickup_available'   => 'boolean',
            'min_order_cents'       => 'integer',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    public function markAsOpen(): void
    {
        $this->update(['status' => RestaurantStatus::Open]);
    }

    public function markAsClosed(): void
    {
        $this->update(['status' => RestaurantStatus::Closed]);
    }

    public function markAsPaused(): void
    {
        $this->update(['status' => RestaurantStatus::Paused]);
    }

    public function isAcceptingOrders(): bool
    {
        return $this->status->isAcceptingOrders();
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeOpen(\Illuminate\Database\Eloquent\Builder $query): void
    {
        $query->where('status', RestaurantStatus::Open->value);
    }

    public function scopeForMerchant(\Illuminate\Database\Eloquent\Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function openingHours(): HasMany
    {
        return $this->hasMany(RestaurantOpeningHour::class)->orderBy('day_of_week');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(RestaurantPhoto::class)->orderBy('sort_order');
    }

    public function menuCategories(): HasMany
    {
        return $this->hasMany(MenuCategory::class)->orderBy('sort_order');
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function foodOrders(): HasMany
    {
        return $this->hasMany(FoodOrder::class);
    }
}
