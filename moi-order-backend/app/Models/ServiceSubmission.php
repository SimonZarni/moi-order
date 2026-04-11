<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\SubmissionStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — owns the base submission record shared across all service types.
 * Principle: Encapsulation — status transitions via domain method only.
 * Principle: Tell-Don't-Ask — complete() sets status + timestamp in one call.
 * Security: price_snapshot is immutable after insert; never recomputed from live prices.
 */
class ServiceSubmission extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'service_type_id',
        'price_snapshot',
        'status',
        'idempotency_key',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'price_snapshot' => 'integer',
            'status'         => SubmissionStatus::class,
            'completed_at'   => 'datetime',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

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

    // ─── Relationships ────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    /** One-to-one: only set when the submission is for a 90-day report. */
    public function ninetyDayReportDetail(): HasOne
    {
        return $this->hasOne(NinetyDayReportDetail::class, 'submission_id');
    }

    /** One-to-one: only set when the submission is for a company registration. */
    public function companyRegistrationDetail(): HasOne
    {
        return $this->hasOne(CompanyRegistrationDetail::class, 'submission_id');
    }

    /** One-to-one: only set when the submission is for an airport fast track. */
    public function airportFastTrackDetail(): HasOne
    {
        return $this->hasOne(AirportFastTrackDetail::class, 'submission_id');
    }

    /** One-to-one: only set when the submission is for an embassy residential. */
    public function embassyResidentialDetail(): HasOne
    {
        return $this->hasOne(EmbassyResidentialDetail::class, 'submission_id');
    }

    /** One-to-one: only set when the submission is for an embassy car license. */
    public function embassyCarLicenseDetail(): HasOne
    {
        return $this->hasOne(EmbassyCarLicenseDetail::class, 'submission_id');
    }

    /** One-to-one: only set when the submission is for an embassy bank. */
    public function embassyBankDetail(): HasOne
    {
        return $this->hasOne(EmbassyBankDetail::class, 'submission_id');
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
