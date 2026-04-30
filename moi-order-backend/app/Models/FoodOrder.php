<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\FoodOrderStatus;
use App\Enums\FoodPaymentMethod;
use App\Exceptions\DomainException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class FoodOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'restaurant_id',
        'status',
        'payment_method',
        'subtotal_cents',
        'total_cents',
        'delivery_address',
        'delivery_lat',
        'delivery_lng',
        'customer_notes',
        'idempotency_key',
        'line_payment_url',
        'confirmed_at',
        'ready_at',
        'completed_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'status'         => FoodOrderStatus::class,
            'payment_method' => FoodPaymentMethod::class,
            'subtotal_cents' => 'integer',
            'total_cents'    => 'integer',
            'delivery_lat'   => 'float',
            'delivery_lng'   => 'float',
            'confirmed_at'   => 'datetime',
            'ready_at'       => 'datetime',
            'completed_at'   => 'datetime',
            'cancelled_at'   => 'datetime',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** @throws DomainException when the transition is not allowed. */
    public function transitionTo(FoodOrderStatus $next): void
    {
        if (! $this->status->canTransitionTo($next)) {
            throw new DomainException(
                "order.invalid_status_transition",
                409,
                ['from' => $this->status->value, 'to' => $next->value],
            );
        }

        $timestamps = match($next) {
            FoodOrderStatus::Confirmed => ['confirmed_at' => now()],
            FoodOrderStatus::Ready     => ['ready_at'     => now()],
            FoodOrderStatus::Completed => ['completed_at' => now()],
            FoodOrderStatus::Cancelled => ['cancelled_at' => now()],
            default                    => [],
        };

        $this->update(array_merge(['status' => $next], $timestamps));
    }

    public function canShowLinePayButton(): bool
    {
        return $this->payment_method === FoodPaymentMethod::LinePay
            && $this->status !== FoodOrderStatus::Pending;
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeForUser(\Illuminate\Database\Eloquent\Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    public function scopeForRestaurant(\Illuminate\Database\Eloquent\Builder $query, int $restaurantId): void
    {
        $query->where('restaurant_id', $restaurantId);
    }

    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): void
    {
        $query->whereNotIn('status', [
            FoodOrderStatus::Completed->value,
            FoodOrderStatus::Cancelled->value,
        ]);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(FoodOrderItem::class);
    }
}
