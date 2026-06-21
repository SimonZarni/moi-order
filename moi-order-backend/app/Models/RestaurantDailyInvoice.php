<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DailyInvoiceStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — single entity for a restaurant's daily cashout invoice.
 * Principle: Tell-Don't-Ask — confirm() encapsulates the paid transition.
 * Principle: ENCAPSULATION — status transitions via domain methods only.
 *
 * @property int                  $id
 * @property int                  $restaurant_id
 * @property \Carbon\Carbon       $date
 * @property int                  $order_count
 * @property int                  $customer_total_cents
 * @property int                  $platform_fee_cents
 * @property int                  $payout_cents
 * @property DailyInvoiceStatus   $status
 * @property int|null             $confirmed_by_id
 * @property \Carbon\Carbon|null  $paid_at
 * @property \Carbon\Carbon       $created_at
 * @property \Carbon\Carbon       $updated_at
 * @property \Carbon\Carbon|null  $deleted_at
 */
class RestaurantDailyInvoice extends Model
{
    use SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'restaurant_id',
        'date',
        'order_count',
        'customer_total_cents',
        'platform_fee_cents',
        'payout_cents',
        'status',
        'confirmed_by_id',
        'paid_at',
    ];

    /** @return array<string, mixed> */
    protected function casts(): array
    {
        return [
            'date'                  => 'date',
            'status'                => DailyInvoiceStatus::class,
            'order_count'           => 'integer',
            'customer_total_cents'  => 'integer',
            'platform_fee_cents'    => 'integer',
            'payout_cents'          => 'integer',
            'confirmed_by_id'       => 'integer',
            'paid_at'               => 'datetime',
        ];
    }

    // ── Relationships ─────────────────────────────────────────────────────────

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    // ── Domain methods ────────────────────────────────────────────────────────

    /** Mark invoice as paid. CQS: mutates, returns void. */
    public function confirm(int $adminId): void
    {
        if ($this->status === DailyInvoiceStatus::Paid) {
            throw new \DomainException('invoice.already_confirmed');
        }
        $this->update([
            'status'          => DailyInvoiceStatus::Paid,
            'confirmed_by_id' => $adminId,
            'paid_at'         => now(),
        ]);
    }

    // ── Named scopes ─────────────────────────────────────────────────────────

    public function scopePending(Builder $q): Builder
    {
        return $q->where('status', DailyInvoiceStatus::Pending->value);
    }

    public function scopePaid(Builder $q): Builder
    {
        return $q->where('status', DailyInvoiceStatus::Paid->value);
    }

    public function scopeForDate(Builder $q, string $date): Builder
    {
        return $q->whereDate('date', $date);
    }

    public function scopeForRestaurant(Builder $q, int $restaurantId): Builder
    {
        return $q->where('restaurant_id', $restaurantId);
    }
}
