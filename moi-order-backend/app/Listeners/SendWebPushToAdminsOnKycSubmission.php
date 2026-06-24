<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\AdminNotificationReceived;
use App\Events\KycApplicationSubmitted;
use App\Models\User;
use App\Notifications\Admin\NewKycNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — one reaction: notify all admins when a merchant submits KYC.
 * Delivers both a VAPID browser push and a database notification with a
 * real-time Pusher ping so the admin dashboard badge updates immediately.
 * Principle: DIP — depends on WebPushInterface, never on the minishlink SDK.
 * ShouldQueue + $afterCommit: deferred until after commit.
 */
class SendWebPushToAdminsOnKycSubmission implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(KycApplicationSubmitted $event): void
    {
        $application  = $event->application->loadMissing('applicant');
        $businessName = $application->business_name ?? 'A merchant';

        User::where('is_admin', true)->each(function (User $admin) use ($application, $businessName): void {
            // 1. Store in DB + real-time Pusher ping for the notifications list.
            $admin->notify(new NewKycNotification($application));
            event(new AdminNotificationReceived($admin, 'new_kyc'));

            // 2. VAPID browser push (for admins with push subscriptions).
            $this->webPush->sendToUser(
                $admin,
                'New Merchant Registration',
                "{$businessName} submitted a KYC application",
                ['type' => 'kyc', 'application_id' => $application->id],
            );
        });
    }
}
