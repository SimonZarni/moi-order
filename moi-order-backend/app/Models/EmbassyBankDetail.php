<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: OCP — embassy-bank-specific fields isolated here.
 *   New service = new detail model. This class is never modified for other services.
 * Principle: SRP — owns only the applicant details for an embassy bank submission.
 */
class EmbassyBankDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'full_name',
        'passport_no',
        'identity_card_no',
        'current_job',
        'company',
        'myanmar_address',
        'thai_address',
        'phone',
        'bank_name',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ServiceSubmission::class, 'submission_id');
    }
}
