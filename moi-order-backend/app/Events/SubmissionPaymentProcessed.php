<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\ServiceSubmission;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a service submission's payment was successfully
 *   processed AND the status transition to Processing was committed.
 *
 * Fired from inside the lockForUpdate block in ServiceSubmission::markProcessing().
 * This guarantees exactly-once delivery: the lock ensures only one thread completes
 * the status transition, so only one SubmissionPaymentProcessed event is ever fired
 * per submission — regardless of how many times PaymentConfirmed fires.
 *
 * Use this event (not PaymentConfirmed) for admin payment notifications so that the
 * same lockForUpdate deduplication that protects user notifications also protects
 * admin notifications.
 */
class SubmissionPaymentProcessed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly ServiceSubmission $submission,
    ) {}
}
