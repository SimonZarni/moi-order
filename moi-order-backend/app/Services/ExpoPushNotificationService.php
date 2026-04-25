<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\ExpoPushMessage;
use App\DTOs\PushToken;
use App\Models\DeviceToken;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Sends push notifications to iOS devices via Expo Push API (which relays to APNs).
 * Android devices are handled by FcmPushNotificationService directly.
 *
 * Expo Push API: https://exp.host/--/api/v2/push/send
 * Limits: max 100 tokens per request, 600 requests/sec per project.
 */
class ExpoPushNotificationService
{
    private const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
    private const CHUNK_SIZE    = 100;

    /**
     * @param PushToken[] $tokens  iOS tokens only
     */
    public function sendAll(array $tokens, ExpoPushMessage $message): void
    {
        if (empty($tokens)) {
            return;
        }

        try {
            foreach (array_chunk($tokens, self::CHUNK_SIZE) as $chunk) {
                $this->sendChunk($chunk, $message);
            }
        } catch (\Throwable $e) {
            Log::warning('ExpoPush: send failed', ['error' => $e->getMessage()]);
        }
    }

    private function sendChunk(array $chunk, ExpoPushMessage $message): void
    {
        $payload = array_map(fn (PushToken $pt): array => [
            'to'       => $pt->token,
            'title'    => $message->title,
            'body'     => $message->body,
            'data'     => $message->data,
            'sound'    => 'default',
            'priority' => 'high',
        ], $chunk);

        $response = Http::timeout(5)
            ->withHeaders(['Accept-Encoding' => 'gzip, deflate'])
            ->post(self::EXPO_PUSH_URL, $payload);

        if (! $response->successful()) {
            Log::warning('ExpoPush: non-2xx response', ['status' => $response->status()]);
            return;
        }

        $this->pruneInvalidTokens($chunk, $response->json('data', []));
    }

    /**
     * @param PushToken[]        $tokens
     * @param array<int, mixed>  $results
     */
    private function pruneInvalidTokens(array $tokens, array $results): void
    {
        foreach ($results as $index => $result) {
            if (($result['details']['error'] ?? null) === 'DeviceNotRegistered') {
                DeviceToken::where('token', $tokens[$index]->token)->delete();
            }
        }
    }
}
