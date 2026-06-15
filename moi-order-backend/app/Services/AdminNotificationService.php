<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Notifications\Admin\NewPaymentNotification;
use App\Notifications\Admin\NewSubmissionNotification;
use App\Notifications\Admin\NewTicketOrderNotification;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Principle: SRP — owns notification read/delete business logic for the admin API.
 * Principle: Information Expert — queries against the admin user's notification relationship.
 * Bell widget: latest 20, max 7 days — fast, no pagination.
 * Full page:   paginated, optional type filter, no TTL cap.
 */
class AdminNotificationService
{
    private const BELL_MAX  = 20;
    private const BELL_DAYS = 7;
    private const PAGE_SIZE = 20;

    // Admin-only notification classes. Filtering by the `type` column (PHP class name,
    // a plain VARCHAR) is more reliable than JSON_EXTRACT on the `data` text column.
    // Also used as a whitelist so the admin bell never shows user-facing notifications
    // (chat_message, food_order_status, etc.) for dual-role users like igzy.
    private const ADMIN_ONLY_CLASSES = [
        NewSubmissionNotification::class,
        NewPaymentNotification::class,
        NewTicketOrderNotification::class,
    ];

    /**
     * For the bell dropdown — last 20, max 7 days old, admin-only types only.
     *
     * @return array{notifications: Collection<int, DatabaseNotification>, unread_count: int}
     */
    public function listForAdmin(User $admin): array
    {
        $since = now()->subDays(self::BELL_DAYS);

        $notifications = $admin->notifications()
            ->whereIn('type', self::ADMIN_ONLY_CLASSES)
            ->where('created_at', '>=', $since)
            ->latest()
            ->limit(self::BELL_MAX)
            ->get();

        $unreadCount = $admin->unreadNotifications()
            ->whereIn('type', self::ADMIN_ONLY_CLASSES)
            ->where('created_at', '>=', $since)
            ->count();

        return [
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ];
    }

    /**
     * For the full notifications page — paginated, optional type filter, no TTL.
     *
     * @return array{notifications: LengthAwarePaginator, unread_count: int}
     */
    public function paginateForAdmin(User $admin, int $page, int $perPage, ?string $type): array
    {
        $query = $admin->notifications()
            ->whereIn('type', self::ADMIN_ONLY_CLASSES)
            ->latest();

        if ($type !== null) {
            $query->where('data->notification_type', $type);
        }

        $notifications = $query->paginate(
            perPage:  min($perPage, 100),
            page:     $page,
        );

        $unreadCount = $admin->unreadNotifications()
            ->whereIn('type', self::ADMIN_ONLY_CLASSES)
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
        // Scope to admin-only classes so this never clears the unread badge on the
        // mobile app for a dual-role user who also has user-facing notifications.
        $admin->unreadNotifications()
            ->whereIn('type', self::ADMIN_ONLY_CLASSES)
            ->update(['read_at' => now()]);
    }

    public function deleteOne(User $admin, string $id): void
    {
        $admin->notifications()->where('id', $id)->firstOrFail()->delete();
    }

    public function deleteAll(User $admin): void
    {
        // Only delete admin-only rows. User-facing notifications belong to the
        // mobile app view and must not be wiped by an admin dashboard "clear all".
        $admin->notifications()
            ->whereIn('type', self::ADMIN_ONLY_CLASSES)
            ->delete();
    }
}
