<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use Illuminate\Notifications\Notification;

/**
 * Principle: OCP — new status copy = update payload() only; no structural changes.
 * Principle: SRP — owns the submission notification payload exclusively.
 *
 * Channel: database only — Pusher broadcast is handled by UserNotificationReceived
 *   (ShouldBroadcastNow), which fires synchronously from the listener after commit.
 */
class SubmissionStatusNotification extends Notification
{
    public function __construct(
        private readonly ServiceSubmission $submission,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    private function payload(): array
    {
        $isProcessing = $this->submission->status === SubmissionStatus::Processing;

        return [
            'notification_type' => 'submission_status',
            'title'             => $isProcessing ? 'Submission Received' : 'Submission Complete',
            'body'              => $isProcessing
                ? 'Your service submission is being processed.'
                : 'Your submission is complete — your result is ready.',
            'submission_id'     => $this->submission->id,
            'status'            => $this->submission->status->value,
        ];
    }
}
