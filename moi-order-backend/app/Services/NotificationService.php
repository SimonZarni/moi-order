<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Notifications\Admin\NewPaymentNotification;
use App\Notifications\Admin\NewSubmissionNotification;
use App\Notifications\Admin\NewTicketOrderNotification;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;

/**
 * Principle: SRP — owns notification read/delete business logic for the user-facing API.
 * Principle: Information Expert — queries against the user's notification relationship.
 */
class NotificationService
{
    private const MAX_COUNT   = 30;
    private const TTL_DAYS    = 30;

    // Admin-only notification classes that must never surface in the mobile app,
    // even when the authenticated user also has is_admin=true on the same User record.
    // Filtering by the `type` column (PHP class name, a plain VARCHAR) is more reliable
    // than JSON_EXTRACT on the `data` text column, which can silently fail if JSON
    // parsing returns NULL (NULL NOT IN (...) = NULL → row incorrectly included).
    private const ADMIN_ONLY_CLASSES = [
        NewSubmissionNotification::class,
        NewPaymentNotification::class,
        NewTicketOrderNotification::class,
    ];

    /**
     * @return array{notifications: Collection<int, DatabaseNotification>, unread_count: int}
     */
    public function listForUser(User $user): array
    {
        $since = now()->subDays(self::TTL_DAYS);

        $notifications = $user->notifications()
            ->where('created_at', '>=', $since)
            ->whereNotIn('type', self::ADMIN_ONLY_CLASSES)
            ->latest()
            ->limit(self::MAX_COUNT)
            ->get();

        $unreadCount = $user->unreadNotifications()
            ->where('created_at', '>=', $since)
            ->whereNotIn('type', self::ADMIN_ONLY_CLASSES)
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
            ->whereNotIn('type', self::ADMIN_ONLY_CLASSES)
            ->update(['read_at' => now()]);
    }

    public function deleteOne(User $user, string $id): void
    {
        $user->notifications()->where('id', $id)->firstOrFail()->delete();
    }

    public function deleteAll(User $user): void
    {
        // Only delete user-facing notifications. Admin-only rows belong to the
        // admin dashboard view and must not be wiped by a mobile "clear all".
        $user->notifications()
            ->whereNotIn('type', self::ADMIN_ONLY_CLASSES)
            ->delete();
    }
}
