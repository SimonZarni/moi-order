<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PushNotificationInterface;
use App\DTOs\ExpoPushMessage;
use App\Models\DeviceToken;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — adapter that calls the Expo Push API exclusively.
 * Principle: OCP — to switch to FCM direct, swap this adapter in AppServiceProvider.
 *
 * Expo Push API: https://exp.host/--/api/v2/push/send
 * Limits: max 100 tokens per request, 600 requests/sec per project.
 *
 * Invalid token pruning: when Expo returns DeviceNotRegistered for a token,
 * that token is deleted from the DB so it is never sent to again.
 */
class ExpoPushNotificationService implements PushNotificationInterface
{
    private const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
    private const CHUNK_SIZE    = 100;

    public function send(array $tokens, ExpoPushMessage $message): void
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
        $payload = array_map(fn (string $token): array => [
            'to'        => $token,
            'title'     => $message->title,
            'body'      => $message->body,
            'data'      => $message->data,
            'sound'     => 'default',
            'priority'  => 'high',
            'channelId' => 'default',
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
     * @param string[]           $tokens
     * @param array<int, mixed>  $results
     */
    private function pruneInvalidTokens(array $tokens, array $results): void
    {
        foreach ($results as $index => $result) {
            if (($result['details']['error'] ?? null) === 'DeviceNotRegistered') {
                DeviceToken::where('token', $tokens[$index])->delete();
            }
        }
    }
}
