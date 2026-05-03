<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\SubmissionPaymentProcessed;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: deliver a browser push to every admin when a
 *   service submission payment completes.
 * Principle: OCP — existing NotifyAdminsOfServicePayment listener is untouched.
 *
 * Listens to SubmissionPaymentProcessed (not PaymentConfirmed) to share the
 * lockForUpdate deduplication from ServiceSubmission::markProcessing() — mirroring
 * the decision in the existing in-app notification listener.
 * $afterCommit ensures the job is only enqueued after the transaction that fired
 * this event commits (the payment write + status transition are in the same tx).
 */
class SendWebPushToAdminsOnServicePayment implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(SubmissionPaymentProcessed $event): void
    {
        $submission  = $event->submission->loadMissing(['user', 'serviceType.service']);
        $userName    = $submission->user?->name ?? 'A user';
        $serviceName = $submission->serviceType?->service?->name
            ?? $submission->serviceType?->name
            ?? 'a service';

        User::where('is_admin', true)->each(function (User $admin) use ($submission, $userName, $serviceName): void {
            $this->webPush->sendToUser(
                $admin,
                'Payment Received',
                "{$userName} paid for {$serviceName}",
                ['type' => 'service_payment', 'submission_id' => $submission->id],
            );
        });
    }
}
