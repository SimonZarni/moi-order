<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

/**
 * Principle: OCP — new status copy = update payload() only; no structural changes.
 * Principle: SRP — owns the submission notification payload exclusively.
 *
 * Channels: database (persisted, shown in notification centre)
 *           broadcast (Pusher — drives live unread count on the mobile client)
 */
class SubmissionStatusNotification extends Notification
{
    public function __construct(
        private readonly ServiceSubmission $submission,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray(object $notifiable): array
    {
        return $this->payload();
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage($this->payload());
    }

    public function broadcastType(): string
    {
        return 'notification.created';
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
