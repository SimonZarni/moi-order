<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\RestaurantPlatformStatus;
use App\Enums\RestaurantStatus;
use App\Traits\HasAuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

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
        'payment_qr_path',
        'status',
        'platform_status',
        'override_until',
        'delivery_radius_km',
        'is_delivery_available',
        'is_pickup_available',
        'min_order_cents',
    ];

    protected $hidden = [
        'cover_photo_path',
        'logo_path',
        'payment_qr_path',
    ];

    protected function casts(): array
    {
        return [
            'status'                => RestaurantStatus::class,
            'platform_status'       => RestaurantPlatformStatus::class,
            'override_until'        => 'datetime',
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

    /**
     * Merchant manual override — sets status AND arms a 3-hour expiry timer.
     * After expiry the effective status reverts to what the opening hours say.
     * Do NOT call this from automated schedulers or admin actions; use
     * markAsOpen/Closed/Paused for those so override_until is left untouched.
     */
    public function overrideStatus(RestaurantStatus $status): void
    {
        $this->update([
            'status'         => $status,
            'override_until' => now()->addHours(3),
        ]);
    }

    public function isOverrideActive(): bool
    {
        return $this->override_until !== null && $this->override_until->isFuture();
    }

    /**
     * The status customers and the merchant UI should see.
     * - While override_until is in the future: respect the stored status column.
     * - After expiry: derive Open/Closed from opening hours sessions.
     * - Falls back to stored status if opening hours relation is not loaded.
     */
    public function effectiveStatus(): RestaurantStatus
    {
        if ($this->isOverrideActive()) {
            return $this->status;
        }

        if (! $this->relationLoaded('openingHours')) {
            return $this->status;
        }

        return $this->isOpenNow() ? RestaurantStatus::Open : RestaurantStatus::Closed;
    }

    public function suspend(): void
    {
        $this->update(['platform_status' => RestaurantPlatformStatus::Suspended]);
    }

    public function activate(): void
    {
        $this->update(['platform_status' => RestaurantPlatformStatus::Active]);
    }

    public function isAcceptingOrders(): bool
    {
        return $this->platform_status->isActive() && $this->effectiveStatus()->isAcceptingOrders();
    }

    /**
     * Real-time check: is the restaurant within its configured opening hours right now?
     * Falls back to the persisted status when openingHours are not loaded or not configured,
     * so admin/merchant manual overrides still work when the relation isn't eager-loaded.
     */
    public function isOpenNow(): bool
    {
        if (! $this->relationLoaded('openingHours')) {
            return $this->status === RestaurantStatus::Open;
        }

        $now      = Carbon::now('Asia/Bangkok');
        $sessions = $this->openingHours->where('day_of_week', $now->dayOfWeek);

        if ($sessions->isEmpty()) {
            return false;
        }

        // Primary session (sort_order=0) carries the is_closed flag for the whole day.
        $primary = $sessions->sortBy('sort_order')->first();
        if ($primary->is_closed) {
            return false;
        }

        $time = $now->format('H:i:s');

        foreach ($sessions as $session) {
            if ($session->opens_at === null || $session->closes_at === null) {
                continue;
            }
            if ($time >= $session->opens_at && $time < $session->closes_at) {
                return true;
            }
        }

        return false;
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeOpen(\Illuminate\Database\Eloquent\Builder $query): void
    {
        $query->where('status', RestaurantStatus::Open->value);
    }

    /** Restaurants visible and available to customers: platform active + merchant open. */
    public function scopeAvailable(\Illuminate\Database\Eloquent\Builder $query): void
    {
        $query->where('platform_status', RestaurantPlatformStatus::Active->value)
              ->where('status', RestaurantStatus::Open->value);
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
        return $this->hasMany(RestaurantOpeningHour::class)
            ->orderBy('day_of_week')
            ->orderBy('sort_order');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(RestaurantPhoto::class)->orderBy('sort_order');
    }

    /**
     * Default (non-session) categories only. Session-specific categories are
     * accessed via RestaurantOpeningHour::sessionMenuCategories().
     */
    public function menuCategories(): HasMany
    {
        return $this->hasMany(MenuCategory::class)
            ->whereNull('opening_hour_id')
            ->orderBy('sort_order');
    }

    /**
     * Returns the DB ID of the opening-hour row whose session window covers
     * the current Bangkok time, or null if no session is active.
     */
    public function getCurrentOpeningHourId(): ?int
    {
        if (! $this->relationLoaded('openingHours')) {
            $this->load('openingHours');
        }

        $now  = Carbon::now('Asia/Bangkok');
        $time = $now->format('H:i:s');

        foreach ($this->openingHours->where('day_of_week', $now->dayOfWeek) as $session) {
            if ($session->is_closed || ! $session->session_menu_enabled || $session->opens_at === null || $session->closes_at === null) {
                continue;
            }
            if ($time >= $session->opens_at && $time < $session->closes_at) {
                return $session->id;
            }
        }

        return null;
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
