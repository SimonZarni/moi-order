<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\KycApplicationApproved;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — reacts to KycApplicationApproved: delivers a Web Push to the merchant's
 *   browser confirming their account is approved and ready.
 * Principle: DIP — depends on WebPushInterface, not WebPushService directly.
 * ShouldQueue + $afterCommit: fires after the approval transaction commits.
 *
 * Note: a merchant in their initial KYC flow will not yet have a web push subscription
 * (PushNotificationManager is only mounted post-approval). sendToUser() handles this
 * gracefully by returning early when no subscriptions exist. Re-submission approvals
 * will reach subscribed merchants correctly.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class SendWebPushToMerchantOnKycApproved implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(KycApplicationApproved $event): void
    {
        $merchant = $event->application->applicant;

        $this->webPush->sendToUser(
            $merchant,
            'KYC Approved!',
            'Your merchant account has been approved. You can now manage your restaurant.',
            ['type' => 'kyc_approved'],
        );
    }
}
