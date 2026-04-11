<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: OCP — embassy-car-license-specific fields are isolated here.
 *   New service = new detail model. This class is never modified for other services.
 * Principle: SRP — owns only the applicant details for an embassy car license submission.
 */
class EmbassyCarLicenseDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'full_name',
        'phone',
    ];

    // ─── Relationships ────────────────────────────────────────────────────────

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ServiceSubmission::class, 'submission_id');
    }
}
