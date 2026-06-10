<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\LineMessagingInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — owns LINE Messaging API push calls only.
 * Principle: DIP — bound to LineMessagingInterface in AppServiceProvider.
 *
 * Best-effort: HTTP failures are logged and swallowed so a LINE API outage
 * never blocks the customer from opening LINE to complete payment.
 */
class LineMessagingService implements LineMessagingInterface
{
    private const PUSH_URL = 'https://api.line.me/v2/bot/message/push';

    public function __construct(
        private readonly string $channelAccessToken,
        private readonly string $adminUserId,
    ) {}

    public function pushToAdmin(string $message): void
    {
        try {
            $response = Http::withToken($this->channelAccessToken)
                ->post(self::PUSH_URL, [
                    'to'       => $this->adminUserId,
                    'messages' => [['type' => 'text', 'text' => $message]],
                ]);

            $response->throw();
        } catch (\Throwable $e) {
            Log::error('LineMessagingService: push failed', [
                'admin_user_id' => $this->adminUserId,
                'error'         => $e->getMessage(),
            ]);
        }
    }
}
