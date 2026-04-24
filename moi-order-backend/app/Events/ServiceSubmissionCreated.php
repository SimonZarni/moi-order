<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\ServiceSubmission;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a new service submission was created by a user.
 * Dispatched AFTER the DB::transaction commits in DynamicSubmissionService::create(),
 * so admin notification rows are written to already-committed data.
 * Not dispatched on idempotency hits (duplicate submissions return early).
 */
class ServiceSubmissionCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly ServiceSubmission $submission,
    ) {}
}
