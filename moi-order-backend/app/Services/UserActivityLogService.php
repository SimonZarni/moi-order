<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\UserActivityLogInterface;
use App\Enums\UserActivityEvent;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

/**
 * Principle: SRP — appends and queries user activity events only.
 * Principle: DIP — consumed via UserActivityLogInterface.
 * Safety: record() catches all exceptions so a log failure never aborts the calling operation.
 */
class UserActivityLogService implements UserActivityLogInterface
{
    public function record(User $user, UserActivityEvent $event, ?array $metadata = null): void
    {
        try {
            UserActivityLog::create([
                'user_id'     => $user->id,
                'event'       => $event->value,
                'event_label' => $event->label(),
                'category'    => $event->category(),
                'metadata'    => $metadata ?: null,
                'ip_address'  => Request::ip(),
                'user_agent'  => Request::userAgent(),
                'created_at'  => now(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('UserActivityLog: failed to record event', [
                'user_id' => $user->id,
                'event'   => $event->value,
                'error'   => $e->getMessage(),
            ]);
        }
    }

    public function forUser(User $user, int $perPage = 50): LengthAwarePaginator
    {
        return UserActivityLog::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}
