<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\LineMessagingInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — owns LINE Messaging API calls only.
 * Principle: DIP — bound to LineMessagingInterface in AppServiceProvider.
 */
class LineMessagingService implements LineMessagingInterface
{
    private const PUSH_URL    = 'https://api.line.me/v2/bot/message/push';
    private const PROFILE_URL = 'https://api.line.me/v2/bot/profile/';

    public function __construct(
        private readonly string $channelAccessToken,
        private readonly string $adminUserId,
    ) {}

    public function isFollowing(string $userId): bool
    {
        try {
            $response = Http::withToken($this->channelAccessToken)
                ->get(self::PROFILE_URL . $userId);

            return $response->successful();
        } catch (\Throwable) {
            return false;
        }
    }

    public function pushToUser(string $userId, string $message): void
    {
        $this->push($userId, $message);
    }

    public function pushToAdmin(string $message): void
    {
        $this->push($this->adminUserId, $message);
    }

    private function push(string $to, string $message): void
    {
        try {
            Http::withToken($this->channelAccessToken)
                ->post(self::PUSH_URL, [
                    'to'       => $to,
                    'messages' => [['type' => 'text', 'text' => $message]],
                ])
                ->throw();
        } catch (\Throwable $e) {
            Log::error('LineMessagingService: push failed', [
                'to'    => $to,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
