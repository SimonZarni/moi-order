<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\PayableInterface;
use App\Enums\SubmissionStatus;
use App\Events\PaymentConfirmed;
use Database\Factories\ServiceSubmissionFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — owns the base submission record shared across all service types.
 * Principle: Encapsulation — status transitions via domain method only.
 * Principle: Tell-Don't-Ask — complete() sets status + timestamp in one call.
 * Security: price_snapshot is immutable after insert; never recomputed from live prices.
 * Option B: all submission fields stored in submission_data JSON; no detail tables.
 */
class ServiceSubmission extends Model implements PayableInterface
{
    /** @use HasFactory<ServiceSubmissionFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'service_type_id',
        'price_snapshot',
        'status',
        'idempotency_key',
        'completed_at',
        'submission_data',
    ];

    protected function casts(): array
    {
        return [
            'price_snapshot'  => 'integer',
            'status'          => SubmissionStatus::class,
            'completed_at'    => 'datetime',
            'submission_data' => 'array',
        ];
    }

    // ─── PayableInterface ─────────────────────────────────────────────────────

    public function getPayableAmountThb(): int
    {
        return $this->price_snapshot;
    }

    public function getPayableAmountSatangs(): int
    {
        return $this->price_snapshot * 100;
    }

    public function getPayableUserEmail(): string
    {
        $this->loadMissing('user');
        return $this->user->email;
    }

    public function onPaymentConfirmed(): void
    {
        event(new PaymentConfirmed($this));
    }

    public function onPaymentFailed(): void
    {
        $this->markPaymentFailed();
    }

    public function resetForPaymentRetry(): void
    {
        if ($this->status === SubmissionStatus::PaymentFailed) {
            $this->update(['status' => SubmissionStatus::PendingPayment]);
        }
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /** Payment confirmed — move to Processing for admin to work on. */
    public function markProcessing(): void
    {
        if ($this->status !== SubmissionStatus::PendingPayment) {
            return;
        }
        $this->update(['status' => SubmissionStatus::Processing]);
    }

    /** Payment failed or expired — user can retry payment. */
    public function markPaymentFailed(): void
    {
        if ($this->status->isTerminal()) {
            return;
        }
        $this->update(['status' => SubmissionStatus::PaymentFailed]);
    }

    /** Mark the submission complete. Admin-triggered; only callable once. */
    public function complete(): void
    {
        if ($this->status->isTerminal()) {
            return;
        }
        $this->update([
            'status'       => SubmissionStatus::Completed,
            'completed_at' => now(),
        ]);
    }

    /** Cancel the submission. Admin-triggered; irreversible. */
    public function cancel(): void
    {
        if ($this->status->isTerminal()) {
            return;
        }
        $this->update(['status' => SubmissionStatus::Cancelled]);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    /** The latest (most recent) payment attempt for this submission. */
    public function payment(): MorphOne
    {
        return $this->morphOne(Payment::class, 'payable')->latestOfMany();
    }

    public function documents(): HasMany
    {
        return $this->hasMany(SubmissionDocument::class, 'submission_id');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeForUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }
}
