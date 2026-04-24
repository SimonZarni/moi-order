<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\PaymentConfirmed;
use App\Events\UserNotificationReceived;
use App\Models\User;
use App\Notifications\Admin\NewPaymentNotification;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — one reaction: notify all admins when a service submission payment is confirmed.
 * Timing: PaymentConfirmed fires inside DB::transaction in StripeWebhookController.
 *   DB::afterCommit() ensures the transaction commits before notifications are written
 *   and Pusher fires — same guard pattern as SendSubmissionNotification.
 */
class NotifyAdminsOfServicePayment
{
    public function handle(PaymentConfirmed $event): void
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
