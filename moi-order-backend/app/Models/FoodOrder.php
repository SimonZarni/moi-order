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
        'order_number',
        'user_id', 'restaurant_id', 'status', 'payment_method',
        'subtotal_cents', 'total_cents', 'delivery_address',
        'delivery_lat', 'delivery_lng', 'customer_notes',
        'idempotency_key', 'prompt_pay_url',
        'confirmed_at', 'payment_confirmed_at', 'preparing_at',
        'picked_up_at', 'delivered_at', 'completed_at', 'cancelled_at',
        'cancel_reason', 'cancel_description',
        'rating', 'customer_review',
    ];

    protected function casts(): array
    {
        return [
            'status'               => FoodOrderStatus::class,
            'payment_method'       => FoodPaymentMethod::class,
            'subtotal_cents'       => 'integer',
            'total_cents'          => 'integer',
            'delivery_lat'         => 'float',
            'delivery_lng'         => 'float',
            'confirmed_at'         => 'datetime',
            'payment_confirmed_at' => 'datetime',
            'preparing_at'         => 'datetime',
            'picked_up_at'         => 'datetime',
            'delivered_at'         => 'datetime',
            'completed_at'         => 'datetime',
            'cancelled_at'         => 'datetime',
            'rating'               => 'integer',
        ];
    }

    // ─── Static factories ─────────────────────────────────────────────────────

    public static function generateOrderNumber(): string
    {
        // Format: MO{dd}{mm}{yy}R{seq3}
        // MO  = MOI ORDER prefix
        // R   = service type (R = Restaurant; expand to T = Tickets, S = Services)
        // seq = 3-digit daily sequence, zero-padded, resets at 00:00
        $datePart = now()->format('dmy'); // e.g. 010226 for 1 Feb 2026
        $today    = now()->startOfDay();

        $seq = static::where('created_at', '>=', $today)->count() + 1;

        return sprintf('MO%sR%03d', $datePart, $seq);
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** @throws DomainException when the transition is not allowed. */
    public function transitionTo(FoodOrderStatus $next): void
    {
        if (! $this->status->canTransitionTo($next)) {
            throw new DomainException(
                'order.invalid_status_transition', 409,
                ['from' => $this->status->value, 'to' => $next->value],
            );
        }

        $timestamps = match($next) {
            FoodOrderStatus::WaitingForPayment  => ['confirmed_at'         => now()],
            FoodOrderStatus::PaymentConfirmed   => ['payment_confirmed_at' => now()],
            FoodOrderStatus::PreparingFood      => ['preparing_at'         => now()],
            FoodOrderStatus::WaitingForDelivery => [],
            FoodOrderStatus::DeliveryOnTheWay   => ['picked_up_at'         => now()],
            FoodOrderStatus::Delivered          => ['delivered_at'         => now()],
            FoodOrderStatus::Completed          => ['completed_at'         => now()],
            FoodOrderStatus::Cancelled          => ['cancelled_at'         => now()],
            default                             => [],
        };

        $this->update(array_merge(['status' => $next], $timestamps));
    }

    public function canShowPromptPay(): bool
    {
        // Payment is processed via LINE channel regardless of payment_method.
        // Show the LINE payment button whenever the order is awaiting customer payment.
        return $this->status === FoodOrderStatus::WaitingForPayment;
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

    public function chatMessages(): HasMany
    {
        return $this->hasMany(\App\Models\OrderChatMessage::class)->orderBy('created_at');
    }
}
