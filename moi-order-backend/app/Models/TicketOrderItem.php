<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: SRP — one line-item in a ticket order.
 * Security: price_snapshot is immutable after insert; never recomputed from live variant prices.
 */
class TicketOrderItem extends Model
{
    protected $fillable = [
        'ticket_order_id',
        'ticket_variant_id',
        'quantity',
        'price_snapshot',
    ];

    protected function casts(): array
    {
        return [
            'quantity'       => 'integer',
            'price_snapshot' => 'integer',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** Line-item subtotal in whole THB. */
    public function subtotalThb(): int
    {
        return $this->price_snapshot * $this->quantity;
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function ticketOrder(): BelongsTo
    {
        return $this->belongsTo(TicketOrder::class);
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(TicketVariant::class, 'ticket_variant_id');
    }
}
