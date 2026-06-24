<?php

declare(strict_types=1);

namespace App\Notifications\Admin;

use App\Models\KycApplication;
use Illuminate\Notifications\Notification;

/**
 * Principle: SRP — owns the admin notification payload for new KYC / merchant registrations.
 * Channel: database only — Pusher broadcast is handled by AdminNotificationReceived
 *   (ShouldBroadcastNow) dispatched from the listener after commit.
 */
class NewKycNotification extends Notification
{
    public function __construct(
        private readonly KycApplication $application,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $businessName = $this->application->business_name ?? 'A merchant';
        $applicantName = $this->application->applicant?->name ?? 'Someone';

        return [
            'notification_type'  => 'new_kyc',
            'title'              => 'New Merchant Registration',
            'body'               => "{$businessName} submitted a KYC application",
            'user_name'          => $applicantName,
            'object_name'        => $businessName,
            'kyc_application_id' => $this->application->id,
        ];
    }
}
