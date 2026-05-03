<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\User;

/**
 * Principle: ISP — isolated contract for browser Web Push delivery.
 * Principle: DIP — callers depend on this abstraction, not the minishlink SDK.
 */
interface WebPushInterface
{
    /**
     * Send a browser push notification to all active subscriptions for the user.
     * Expired subscriptions (410 Gone) are deleted automatically.
     *
     * @param array<string, mixed> $data
     */
    public function sendToUser(User $user, string $title, string $body, array $data = []): void;
}
