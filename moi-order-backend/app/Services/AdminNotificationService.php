<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;

/**
 * Principle: SRP — owns notification read/delete business logic for the admin API.
 * Principle: Information Expert — queries against the admin user's notification relationship.
 * Week filter: only returns notifications from the last 7 days — keeps the list
 *   current without accumulating stale rows in the response.
 */
class AdminNotificationService
{
    private const MAX_COUNT = 20;
    private const TTL_DAYS  = 7;

    /**
     * @return array{notifications: Collection<int, DatabaseNotification>, unread_count: int}
     */
    public function listForAdmin(User $admin): array
    {
        $since = now()->subDays(self::TTL_DAYS);

        $notifications = $admin->notifications()
            ->where('created_at', '>=', $since)
            ->latest()
            ->limit(self::MAX_COUNT)
            ->get();

        $unreadCount = $admin->unreadNotifications()
            ->where('created_at', '>=', $since)
            ->count();

        return [
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ];
    }

    public function markOneRead(User $admin, string $id): void
    {
        $admin->notifications()
            ->where('id', $id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    public function markAllRead(User $admin): void
    {
        $admin->unreadNotifications()
            ->where('created_at', '>=', now()->subDays(self::TTL_DAYS))
            ->update(['read_at' => now()]);
    }
}
