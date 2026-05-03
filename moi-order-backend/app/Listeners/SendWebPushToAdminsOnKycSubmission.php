<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\KycApplicationSubmitted;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: deliver a browser push to every admin when a
 *   KYC application is submitted for review.
 * Principle: DIP — depends on WebPushInterface, never on the minishlink SDK.
 * ShouldQueue + $afterCommit: VAPID HTTP calls deferred until after commit.
 */
class SendWebPushToAdminsOnKycSubmission implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(KycApplicationSubmitted $event): void
    {
        $application   = $event->application->loadMissing('applicant');
        $businessName  = $application->business_name ?? 'A merchant';

        User::where('is_admin', true)->each(function (User $admin) use ($application, $businessName): void {
            $this->webPush->sendToUser(
                $admin,
                'New KYC Application',
                "{$businessName} submitted a KYC application",
                ['type' => 'kyc', 'application_id' => $application->id],
            );
        });
    }
}
