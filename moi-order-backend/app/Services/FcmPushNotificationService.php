<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\ExpoPushMessage;
use App\DTOs\PushToken;
use App\Models\DeviceToken;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Sends push notifications to Android devices via FCM v1 API.
 *
 * Uses a service account JWT to obtain a short-lived OAuth2 access token
 * (cached for 55 minutes — tokens are valid for 60 min, 5 min margin).
 * Each token is tied to com.moiorder.app via FCM, so notifications always
 * open the correct APK regardless of whether Expo Go is on the same device.
 */
class FcmPushNotificationService
{
    private const FCM_URL     = 'https://fcm.googleapis.com/v1/projects/%s/messages:send';
    private const TOKEN_CACHE = 'fcm_oauth_token';
    private const SCOPE       = 'https://www.googleapis.com/auth/firebase.messaging';

    public function __construct(
        private readonly string $projectId,
        private readonly string $credentialsPath,
    ) {}

    /**
     * @param PushToken[] $tokens  Android tokens only
     */
    public function sendAll(array $tokens, ExpoPushMessage $message): void
    {
        if (empty($tokens)) {
            return;
        }

        $accessToken = $this->getAccessToken();
        $url         = sprintf(self::FCM_URL, $this->projectId);

        foreach ($tokens as $pushToken) {
            $this->sendOne($pushToken, $message, $accessToken, $url);
        }
    }

    private function sendOne(
        PushToken     $pushToken,
        ExpoPushMessage $message,
        string        $accessToken,
        string        $url,
    ): void {
        // FCM data values must all be strings.
        $data = array_map('strval', $message->data);

        $payload = [
            'message' => [
                'token'        => $pushToken->token,
                'notification' => [
                    'title' => $message->title,
                    'body'  => $message->body,
                ],
                'android' => [
                    'priority'     => 'high',
                    'notification' => [
                        'channel_id'  => 'default',
                        'sound'       => 'default',
                        'click_action'=> 'FLUTTER_NOTIFICATION_CLICK',
                    ],
                ],
                'data' => $data,
            ],
        ];

        $response = Http::timeout(5)
            ->withToken($accessToken)
            ->post($url, $payload);

        if ($response->status() === 404) {
            // Token no longer registered — prune it so it is never retried.
            DeviceToken::where('token', $pushToken->token)->delete();
            return;
        }

        if (! $response->successful()) {
            Log::warning('FCM: send failed', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);
        }
    }

    private function getAccessToken(): string
    {
        return Cache::remember(self::TOKEN_CACHE, 55 * 60, function (): string {
            $credentials = new ServiceAccountCredentials(self::SCOPE, $this->credentialsPath);
            $token       = $credentials->fetchAuthToken();

            return $token['access_token'] ?? throw new \RuntimeException('FCM: failed to fetch OAuth2 token');
        });
    }
}
