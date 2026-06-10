<?php

declare(strict_types=1);

namespace App\Contracts;

interface LineMessagingInterface
{
    /**
     * Send a push text message to the configured LINE admin user.
     * Best-effort: implementations must not throw on API failure.
     */
    public function pushToAdmin(string $message): void;
}
