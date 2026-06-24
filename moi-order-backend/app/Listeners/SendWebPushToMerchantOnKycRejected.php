<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\WebPushInterface;
use App\Events\KycApplicationRejected;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Principle: SRP — reacts to KycApplicationRejected: delivers a Web Push alerting the
 *   merchant that their KYC application needs attention.
 * Principle: DIP — depends on WebPushInterface, not WebPushService directly.
 * ShouldQueue + $afterCommit: fires after the rejection transaction commits.
 *
 * LISTENER REGISTRATION: auto-discovered via typed handle(). Do NOT also add
 * Event::listen() in AppServiceProvider — that would fire this listener twice.
 */
class SendWebPushToMerchantOnKycRejected implements ShouldQueue
{
    public bool $afterCommit = true;

    public function __construct(private readonly WebPushInterface $webPush) {}

    public function handle(KycApplicationRejected $event): void
    {
        $merchant = $event->application->applicant;

        $this->webPush->sendToUser(
            $merchant,
            'KYC Update',
            'Your KYC application needs attention. Please review the feedback and resubmit.',
            ['type' => 'kyc_rejected'],
        );
    }
}
