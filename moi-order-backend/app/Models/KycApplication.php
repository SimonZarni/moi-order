<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\KycApplicationStatus;
use App\Enums\KycDocumentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: Encapsulation — state transitions via domain methods only.
 * Principle: Tell-Don't-Ask — $app->approve($admin) not $app->status = 'approved'.
 * Principle: SRP — one entity, its own domain methods and scopes.
 */
class KycApplication extends Model
{
    use SoftDeletes;

    /**
     * @var list<string>
     * Principle: Security — $fillable explicit, never $guarded=[].
     */
    protected $fillable = [
        'user_id',
        'type',
        'business_name',
        'business_type',
        'business_address',
        'business_phone',
        'status',
        'review_notes',
        'reviewed_by',
        'reviewed_at',
        'submitted_at',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'status'      => KycApplicationStatus::class,
            'submitted_at' => 'datetime',
            'reviewed_at'  => 'datetime',
        ];
    }

    // ─── Domain methods ───────────────────────────────────────────────────────

    /**
     * Transition to Submitted state.
     * Principle: CQS — mutates state, returns void.
     */
    public function submit(): void
    {
        $this->update([
            'status'       => KycApplicationStatus::Submitted,
            'submitted_at' => now(),
        ]);
    }

    /**
     * Withdraw a draft application before submission.
     * Principle: Encapsulation — caller does not manipulate raw columns.
     */
    public function cancel(): void
    {
        $this->delete();
    }

    /**
     * Transition to Approved state and elevate user to merchant.
     * Principle: Encapsulation — caller does not manipulate raw columns.
     */
    public function approve(User $admin, ?string $notes): void
    {
        $this->update([
            'status'       => KycApplicationStatus::Approved,
            'reviewed_by'  => $admin->id,
            'reviewed_at'  => now(),
            'review_notes' => $notes,
        ]);

        // Domain side-effect: the applicant becomes a merchant.
        $this->applicant->update(['is_merchant' => true]);

        if ($this->type === 'resubmission') {
            // Resubmission: only update name and address on the existing restaurant.
            $this->applicant->restaurant()->update([
                'name'    => $this->business_name,
                'address' => $this->business_address,
            ]);
        } else {
            // Initial KYC: create restaurant (or update if exists from a prior draft).
            $restaurantData = [
                'name'    => $this->business_name,
                'address' => $this->business_address,
                'phone'   => $this->business_phone,
            ];

            if ($this->applicant->restaurant()->exists()) {
                $this->applicant->restaurant()->update($restaurantData);
            } else {
                $this->applicant->restaurant()->create($restaurantData);
            }
        }
    }

    /**
     * Transition to Rejected state.
     * Notes are mandatory on rejection (enforced in FormRequest + Service).
     */
    public function reject(User $admin, string $notes): void
    {
        $this->update([
            'status'       => KycApplicationStatus::Rejected,
            'reviewed_by'  => $admin->id,
            'reviewed_at'  => now(),
            'review_notes' => $notes,
        ]);
    }

    /**
     * Returns the set of uploaded KycDocumentType string values for this application.
     * pluck('type') returns enum instances due to the KycDocument cast — map to ->value
     * so in_array() string comparisons work correctly in hasAllRequiredDocuments().
     *
     * @return array<string>
     */
    public function uploadedDocumentTypes(): array
    {
        return $this->documents()
            ->pluck('type')
            ->map(fn (KycDocumentType $t) => $t->value)
            ->toArray();
    }

    /**
     * Check that all four required types are present.
     */
    public function hasAllRequiredDocuments(): bool
    {
        $uploaded = $this->uploadedDocumentTypes();

        foreach (KycDocumentType::cases() as $type) {
            if (! in_array($type->value, $uploaded, strict: true)) {
                return false;
            }
        }

        return true;
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    /**
     * Applications awaiting admin action.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->whereIn('status', [
            KycApplicationStatus::Submitted->value,
            KycApplicationStatus::UnderReview->value,
        ]);
    }

    /**
     * Scope to a specific user.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForUser(\Illuminate\Database\Eloquent\Builder $query, int $userId): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('user_id', $userId);
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(KycDocument::class);
    }
}
