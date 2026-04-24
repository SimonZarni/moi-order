<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\SubmissionPaymentProcessed;
use App\Events\UserNotificationReceived;
use App\Models\User;
use App\Notifications\Admin\NewPaymentNotification;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — one reaction: notify all admins when a service submission payment
 *   is confirmed AND the submission has transitioned to Processing.
 *
 * Listens to SubmissionPaymentProcessed (not PaymentConfirmed) because
 * SubmissionPaymentProcessed is fired from inside the lockForUpdate block in
 * ServiceSubmission::markProcessing(). That lock guarantees this event fires at
 * most once per submission, preventing duplicate admin notifications when both
 * the client-side callback and the Stripe webhook call PaymentConfirmed concurrently.
 *
 * DB::afterCommit() defers the notify() calls until the outer transaction commits,
 * ensuring notification rows are written to committed data.
 */
class NotifyAdminsOfServicePayment
{
    public function handle(SubmissionPaymentProcessed $event): void
    {
        $submission = $event->submission->loadMissing(['user', 'serviceType.service']);

        $serviceName = $submission->serviceType->service->name
            ?? $submission->serviceType->name
            ?? 'a service';

        $body = ($submission->user->name ?? 'A user') . " paid for {$serviceName}";

        DB::afterCommit(function () use ($submission, $body): void {
            User::where('is_admin', true)->each(function (User $admin) use ($submission, $body): void {
                $admin->notify(new NewPaymentNotification($body, [
                    'submission_id' => $submission->id,
                ]));
                event(new UserNotificationReceived($admin));
            });
        });
    }
}
