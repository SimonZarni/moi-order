<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;

/**
 * Principle: SRP — owns notification read/delete business logic for the user-facing API.
 * Principle: Information Expert — queries against the user's notification relationship.
 */
class NotificationService
{
    private const MAX_COUNT   = 10;
    private const TTL_DAYS    = 7;

    /**
     * @return array{notifications: Collection<int, DatabaseNotification>, unread_count: int}
     */
    public function listForUser(User $user): array
    {
        $since = now()->subDays(self::TTL_DAYS);

        $notifications = $user->notifications()
            ->where('created_at', '>=', $since)
            ->latest()
            ->limit(self::MAX_COUNT)
            ->get();

        $unreadCount = $user->unreadNotifications()
            ->where('created_at', '>=', $since)
            ->count();

        return [
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ];
    }

    public function markOneRead(User $user, string $id): void
    {
        $user->notifications()
            ->where('id', $id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function markAllRead(User $user): void
    {
        $user->unreadNotifications()->update(['read_at' => now()]);
    }

    public function deleteOne(User $user, string $id): void
    {
        $user->notifications()->where('id', $id)->firstOrFail()->delete();
    }

    public function deleteAll(User $user): void
    {
        $user->notifications()->delete();
    }
}
