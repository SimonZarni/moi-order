<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: OCP — test-service-specific fields are isolated here.
 * Principle: SRP — owns only the applicant details for a test service submission.
 */
class TestServiceDetail extends Model
{
    protected $fillable = [
        'submission_id',
        'full_name',
        'phone',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ServiceSubmission::class, 'submission_id');
    }
}
