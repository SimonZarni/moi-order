<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\SubmissionStatus;
use App\Events\SubmissionStatusChanged;
use App\Notifications\SubmissionStatusNotification;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — one reaction: notify the user when their submission status changes.
 * Timing: notify() is wrapped in DB::afterCommit() so the notification row is committed
 *   and Pusher fires only after the outer transaction completes. Without this, the client
 *   receives the Pusher event while the transaction is still open, refetches the
 *   notifications list, and gets stale data (unread_count: 0), overwriting the optimistic
 *   badge increment. When there is no active transaction, afterCommit() runs immediately.
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

        DB::afterCommit(function () use ($submission): void {
            $submission->user->notify(new SubmissionStatusNotification($submission));
        });
    }
}
