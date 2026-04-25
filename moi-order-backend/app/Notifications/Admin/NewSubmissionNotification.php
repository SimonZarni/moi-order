<?php

declare(strict_types=1);

namespace App\Notifications\Admin;

use App\Models\ServiceSubmission;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns the admin notification payload for new service submissions.
 * Channel: database only — Pusher broadcast is handled by UserNotificationReceived
 *   (ShouldBroadcastNow) dispatched from the listener after commit.
 */
class NewSubmissionNotification extends Notification
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
        $serviceName = $this->submission->serviceType->service->name_mm
            ?: $this->submission->serviceType->name_mm
            ?: $this->submission->serviceType->service->name_en
            ?: $this->submission->serviceType->name_en
            ?: 'a service';

        $userName = $this->submission->user->name ?? 'A user';

        return [
            'notification_type' => 'new_submission',
            'title'             => 'New Service Submission',
            'body'              => "{$userName} submitted {$serviceName}",
            'submission_id'     => $this->submission->id,
        ];
    }
}
