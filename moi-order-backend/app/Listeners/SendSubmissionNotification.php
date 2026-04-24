<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\SubmissionStatus;
use App\Events\SubmissionStatusChanged;
use App\Notifications\SubmissionStatusNotification;

/**
 * Principle: SRP — one reaction: notify the user when their submission status changes.
 * Synchronous: QUEUE_CONNECTION=sync makes ShouldQueue + afterCommit fire twice (once
 *   via immediate sync dispatch, once via DB::afterCommit callback). Running synchronously
 *   fires exactly once. Acceptable because notification sending is fast.
 * Guard: only notifies for statuses the user cares about (Processing, Completed).
 */
class SendSubmissionNotification
{
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
