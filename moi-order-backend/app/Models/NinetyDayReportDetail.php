<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: OCP — 90-day-report-specific fields are isolated here.
 *   New service = new detail model. This class is never modified.
 * Principle: SRP — owns only the applicant details for a 90-day report.
 */
class NinetyDayReportDetail extends Model
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
