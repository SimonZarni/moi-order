<?php

declare(strict_types=1);

namespace App\Contracts;

interface LineMessagingInterface
{
    /**
     * Returns true if the given LINE user ID follows this OA.
     * Returns false on any API error (treat as not-following).
     */
    public function isFollowing(string $userId): bool;

    /**
     * Push a text message to a specific LINE user.
     * Best-effort: must not throw on API failure.
     */
    public function pushToUser(string $userId, string $message): void;

    /**
     * Push a text message to the configured admin group/user.
     * Best-effort: must not throw on API failure.
     */
    public function pushToAdmin(string $message): void;
}
