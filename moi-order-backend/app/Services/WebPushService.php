<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\WebPushInterface;
use App\Models\PushSubscription;
use App\Models\User;
use Minishlink\WebPush\Notification;
use Minishlink\WebPush\Subscription;
use Minishlink\WebPush\WebPush;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — wraps minishlink/web-push; owns VAPID config and delivery.
 * Principle: DIP — consumers depend on WebPushInterface, never on this class directly.
 *
 * Expired subscription cleanup: the VAPID push server returns 410 Gone when
 * a subscription is no longer valid (user cleared browser data, revoked permission).
 * We delete those rows so they never accumulate and slow down future sends.
 */
class WebPushService implements WebPushInterface
{
    private WebPush $webPush;

    public function __construct()
    {
        $this->webPush = new WebPush([
            'VAPID' => [
                'subject'    => config('services.vapid.subject'),
                'publicKey'  => config('services.vapid.public_key'),
                'privateKey' => config('services.vapid.private_key'),
            ],
        ]);

        // Do not throw on partial failures — handle per-result below.
        $this->webPush->setAutomaticPadding(false);
    }

    public function sendToUser(User $user, string $title, string $body, array $data = []): void
    {
        $subscriptions = PushSubscription::where('user_id', $user->id)->get();

        if ($subscriptions->isEmpty()) {
            return;
        }

        $payload = json_encode([
            'title' => $title,
            'body'  => $body,
            'data'  => $data,
        ]);

        $expiredIds = [];

        foreach ($subscriptions as $sub) {
            $subscription = Subscription::create([
                'endpoint'        => $sub->endpoint,
                'contentEncoding' => 'aesgcm',
                'keys'            => [
                    'p256dh' => $sub->p256dh_key,
                    'auth'   => $sub->auth_key,
                ],
            ]);

            $notification = Notification::create()->withPayload($payload);

            try {
                $report = $this->webPush->sendOneNotification($notification, $subscription);

                if (!$report->isSuccess()) {
                    $statusCode = $report->getResponse()?->getStatusCode();

                    // 410 Gone = subscription expired/revoked — remove it
                    if ($statusCode === 410) {
                        $expiredIds[] = $sub->id;
                    } else {
                        Log::warning('[WebPush] Push failed', [
                            'user_id'     => $user->id,
                            'status_code' => $statusCode,
                            'reason'      => $report->getReason(),
                        ]);
                    }
                }
            } catch (\Throwable $e) {
                Log::error('[WebPush] Exception sending push', [
                    'user_id' => $user->id,
                    'error'   => $e->getMessage(),
                ]);
            }
        }

        if (!empty($expiredIds)) {
            PushSubscription::whereIn('id', $expiredIds)->delete();
        }
    }
}
