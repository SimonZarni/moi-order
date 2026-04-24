<?php

declare(strict_types=1);

namespace App\Models;

use App\Contracts\PayableInterface;
use App\Enums\TicketOrderStatus;
use App\Events\TicketOrderPaymentConfirmed;
use App\Events\TicketOrderStatusChanged;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — owns the ticket order header record only.
 * Principle: Encapsulation — status transitions via domain methods only.
 * Principle: Tell-Don't-Ask — markProcessing() owns the guard; callers do not inspect status.
 * Principle: DIP — implements PayableInterface so PaymentService never depends on this model.
 * Security: visit_date validated server-side to max today+6 days; never trusted from client.
 */
class TicketOrder extends Model implements PayableInterface
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'ticket_id',
        'visit_date',
        'status',
        'idempotency_key',
        'eticket_path',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'visit_date'   => 'date',
            'status'       => TicketOrderStatus::class,
            'completed_at' => 'datetime',
        ];
    }

    // ─── PayableInterface ─────────────────────────────────────────────────────

    public function getPayableAmountThb(): int
    {
        $this->loadMissing('items');
        return (int) $this->items->sum(fn (TicketOrderItem $i) => $i->subtotalThb());
    }

    public function getPayableAmountSatangs(): int
    {
        return $this->getPayableAmountThb() * 100;
    }

    public function getPayableUserEmail(): string
    {
        $this->loadMissing('user');
        return $this->user->email;
    }

    public function onPaymentConfirmed(): void
    {
        event(new TicketOrderPaymentConfirmed($this));
    }

    public function onPaymentFailed(): void
    {
        $this->markPaymentFailed();
    }

    public function resetForPaymentRetry(): void
    {
        if ($this->status === TicketOrderStatus::PaymentFailed) {
            $this->update(['status' => TicketOrderStatus::PendingPayment]);
        }
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /**
     * Payment confirmed — move to Processing for admin to work on.
     *
     * Security: re-reads the row with lockForUpdate() inside the caller's open transaction
     * to close the race window between the client-side PaymentService confirmation and the
     * Stripe webhook both calling onPaymentConfirmed() concurrently. Without the lock, both
     * threads can pass the status guard before either commits, producing two TicketOrderStatusChanged
     * events and therefore two notification rows for the same transition.
     *
     * Must be called inside DB::transaction — lockForUpdate() is a no-op outside one.
     */
    public function markProcessing(): void
    {
        $locked = static::where('id', $this->id)
            ->lockForUpdate()
            ->first();

        if ($locked === null || $locked->status !== TicketOrderStatus::PendingPayment) {
            return;
        }

        $locked->update(['status' => TicketOrderStatus::Processing]);
        event(new TicketOrderStatusChanged($locked->fresh()));
    }

    public function markPaymentFailed(): void
    {
        if ($this->status->isTerminal()) {
            return;
        }
        $this->update(['status' => TicketOrderStatus::PaymentFailed]);
    }

    public function markCompleted(string $eticketPath): void
    {
        $wasTerminal = $this->status->isTerminal();

        $updates = ['eticket_path' => $eticketPath];

        if (! $wasTerminal) {
            $updates['status']       = TicketOrderStatus::Completed;
            $updates['completed_at'] = now();
        }

        $this->update($updates);

        if (! $wasTerminal) {
            event(new TicketOrderStatusChanged($this->fresh()));
        }
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(TicketOrderItem::class);
    }

    public function payment(): MorphOne
    {
        return $this->morphOne(Payment::class, 'payable')->latestOfMany();
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeForUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }
}
