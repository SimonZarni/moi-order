<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — single entity for merchant in-app notification inbox.
 * Principle: Tell-Don't-Ask — markRead() encapsulates the transition.
 * Principle: ENCAPSULATION — status transitions via domain methods.
 *
 * @property int         $id
 * @property int         $merchant_id
 * @property string      $type          new_order | order_status | system
 * @property string      $title
 * @property string      $body
 * @property int|null    $order_id
 * @property \Carbon\Carbon|null $read_at
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class MerchantNotification extends Model
{
    use SoftDeletes;

    /** @var list<string> */
    protected $fillable = [
        'merchant_id',
        'type',
        'title',
        'body',
        'order_id',
        'read_at',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'merchant_id' => 'integer',
        'order_id'    => 'integer',
        'read_at'     => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────────────────

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'merchant_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(FoodOrder::class, 'order_id');
    }

    // ── Domain methods ────────────────────────────────────────────────────────

    /** Mark this notification as read. CQS: mutates, returns void. */
    public function markRead(): void
    {
        if ($this->read_at !== null) {
            return; // idempotent
        }
        $this->update(['read_at' => now()]);
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }

    // ── Named scopes ─────────────────────────────────────────────────────────

    public function scopeForMerchant(Builder $q, int $merchantId): Builder
    {
        return $q->where('merchant_id', $merchantId);
    }

    public function scopeUnread(Builder $q): Builder
    {
        return $q->whereNull('read_at');
    }
}
