<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\ServiceSubmissionCreated;
use App\Events\UserNotificationReceived;
use App\Models\User;
use App\Notifications\Admin\NewSubmissionNotification;

/**
 * Principle: SRP — one reaction: notify all admins when a new service submission is created.
 * Timing: ServiceSubmissionCreated fires AFTER the transaction commits in
 *   DynamicSubmissionService, so notification rows are written to committed data.
 *   No DB::afterCommit() needed here.
 * Security: queries admins via is_admin=true scope — never exposes cross-user data.
 */
class NotifyAdminsOfNewSubmission
{
    public function handle(ServiceSubmissionCreated $event): void
    {
        $submission = $event->submission->loadMissing(['user', 'serviceType.service']);

        User::where('is_admin', true)->each(function (User $admin) use ($submission): void {
            $admin->notify(new NewSubmissionNotification($submission));
            event(new UserNotificationReceived($admin));
        });
    }
}
