<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns notification read/delete business logic for the user-facing API.
 * Principle: Information Expert — queries against the user's notification relationship.
 */
class NotificationService
{
    private const MAX_COUNT   = 30;
    private const TTL_DAYS    = 30;

    // Admin-only notification_type values that must never surface in the mobile app,
    // even when the authenticated user also has is_admin=true on the same User record.
    private const ADMIN_ONLY_TYPES = ['new_submission', 'new_payment', 'new_ticket_order'];

    /**
     * @return array{notifications: Collection<int, DatabaseNotification>, unread_count: int}
     */
    public function listForUser(User $user): array
    {
        $since = now()->subDays(self::TTL_DAYS);

        $notifications = $user->notifications()
            ->where('created_at', '>=', $since)
            ->whereNotIn(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.notification_type'))"), self::ADMIN_ONLY_TYPES)
            ->latest()
            ->limit(self::MAX_COUNT)
            ->get();

        $unreadCount = $user->unreadNotifications()
            ->where('created_at', '>=', $since)
            ->whereNotIn(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.notification_type'))"), self::ADMIN_ONLY_TYPES)
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
        $user->unreadNotifications()
            ->whereNotIn(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.notification_type'))"), self::ADMIN_ONLY_TYPES)
            ->update(['read_at' => now()]);
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
