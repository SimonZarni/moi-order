<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — owns one payment attempt record only.
 * Principle: Encapsulation — status transitions via domain method only.
 * Principle: OCP — polymorphic payable allows new payable types without modifying this model.
 * Security: stripe_payload is write-once from webhook; never exposed via API.
 */
class Payment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'payable_type',
        'payable_id',
        'stripe_intent_id',
        'amount',
        'currency',
        'status',
        'qr_image_url',
        'expires_at',
        'stripe_payload',
        'idempotency_key',
    ];

    protected function casts(): array
    {
        return [
            'amount'         => 'integer',
            'status'         => PaymentStatus::class,
            'expires_at'     => 'datetime',
            'stripe_payload' => 'array',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    public function markSucceeded(array $stripePayload): void
    {
        $this->update([
            'status'         => PaymentStatus::Succeeded,
            'stripe_payload' => $stripePayload,
        ]);
    }

    public function markFailed(array $stripePayload): void
    {
        $this->update([
            'status'         => PaymentStatus::Failed,
            'stripe_payload' => $stripePayload,
        ]);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function payable(): MorphTo
    {
        return $this->morphTo();
    }
}
