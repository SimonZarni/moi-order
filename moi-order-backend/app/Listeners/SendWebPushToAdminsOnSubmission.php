<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\ServiceSubmissionCreated;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: deliver a browser push to every admin's registered
 *   subscriptions when a new service submission arrives.
 * Principle: OCP — existing NotifyAdminsOfNewSubmission listener is untouched;
 *   WebPush delivery is added as a separate listener class.
 * Principle: DIP — depends on WebPushInterface, never on the minishlink SDK directly.
 *
 * ShouldQueue: VAPID HTTP calls must not block the request that created the submission.
 * $afterCommit: job is only enqueued after the wrapping transaction commits, so a
 *   rollback never triggers a phantom browser notification.
 */
class SendWebPushToAdminsOnSubmission implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(ServiceSubmissionCreated $event): void
    {
        $submission  = $event->submission->loadMissing(['user', 'serviceType.service']);
        $userName    = $submission->user?->name ?? 'A user';
        $serviceName = $submission->serviceType?->service?->name
            ?? $submission->serviceType?->name
            ?? 'a service';

        User::where('is_admin', true)->each(function (User $admin) use ($submission, $userName, $serviceName): void {
            $this->webPush->sendToUser(
                $admin,
                'New Service Submission',
                "{$userName} submitted {$serviceName}",
                ['type' => 'submission', 'submission_id' => $submission->id],
            );
        });
    }
}
