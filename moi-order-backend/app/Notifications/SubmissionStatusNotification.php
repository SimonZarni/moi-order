<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Channels\ExpoPushChannel;
use App\DTOs\ExpoPushMessage;
use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use Illuminate\Notifications\Notification;

/**
 * Principle: OCP — new status copy = update payload() only; no structural changes.
 * Principle: SRP — owns the submission notification payload exclusively.
 *
 * Channels:
 *   database       — persisted row, read by NotificationsScreen.
 *   ExpoPushChannel — OS-level push banner via Expo Push API.
 * Pusher broadcast is handled separately by UserNotificationReceived (ShouldBroadcastNow).
 */
class SubmissionStatusNotification extends Notification
{
    public function __construct(
        private readonly ServiceSubmission $submission,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', ExpoPushChannel::class];
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toExpoPush(object $notifiable): ExpoPushMessage
    {
        $payload = $this->payload();

        return new ExpoPushMessage(
            title: $payload['title'],
            body:  $payload['body'],
            data:  [
                'notification_type' => 'submission_status',
                'submission_id'     => $this->submission->id,
            ],
        );
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
