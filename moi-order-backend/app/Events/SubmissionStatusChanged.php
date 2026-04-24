<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\ServiceSubmission;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a submission's status has changed.
 * Fired from domain methods (markProcessing, markCompleted, complete) after each transition.
 */
class SubmissionStatusChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly ServiceSubmission $submission,
    ) {}
}
