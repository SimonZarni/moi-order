<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\UserActivityEvent;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserActivityLogInterface
{
    /**
     * Append one activity event for the given user.
     * Never throws — failures are swallowed so logging never aborts a primary operation.
     *
     * @param array<string, mixed>|null $metadata
     */
    public function record(User $user, UserActivityEvent $event, ?array $metadata = null): void;

    /**
     * Return paginated activity log for the given user, newest first.
     *
     * @return LengthAwarePaginator<UserActivityLog>
     */
    public function forUser(User $user, int $perPage = 50): LengthAwarePaginator;
}
