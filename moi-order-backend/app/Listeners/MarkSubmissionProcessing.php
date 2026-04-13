<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\SubmissionStatus;
use App\Events\PaymentConfirmed;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: move submission to Processing on payment confirmation.
 * ShouldQueue: listener failure never rolls back the webhook transaction.
 */
class MarkSubmissionProcessing implements ShouldQueue
{
    public function handle(PaymentConfirmed $event): void
    {
        $submission = $event->submission;

        // Guard: already moved past this state (e.g. duplicate webhook delivery).
        if ($submission->status !== SubmissionStatus::PendingPayment) {
            return;
        }

        $submission->update(['status' => SubmissionStatus::Processing]);
    }
}
