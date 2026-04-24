<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\SubmissionStatus;
use App\Events\SubmissionStatusChanged;
use App\Notifications\SubmissionStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: notify the user when their submission status changes.
 * Queued + afterCommit: dispatched only after the wrapping DB transaction commits,
 *   preventing notifications for rolled-back writes (e.g. failed Stripe webhook processing).
 * Guard: only notifies for statuses the user cares about (Processing, Completed).
 */
class SendSubmissionNotification implements ShouldQueue
{
    public bool $afterCommit = true;

    public function handle(SubmissionStatusChanged $event): void
    {
        $submission = $event->submission->loadMissing('user');

        if (! in_array($submission->status, [
            SubmissionStatus::Processing,
            SubmissionStatus::Completed,
        ], true)) {
            return;
        }

        $submission->user->notify(new SubmissionStatusNotification($submission));
    }
}
