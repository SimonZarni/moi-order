<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CustomNotificationDTO;
use App\Enums\CustomNotificationTargetType;
use App\Enums\UserStatusEnum;
use App\Events\UserNotificationReceived;
use App\Models\CustomNotification;
use App\Models\User;
use App\Notifications\CustomAnnouncementNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns the custom notification send logic exclusively.
 * Principle: Security — 'all' target excludes admin users and non-active accounts.
 *
 * DB::afterCommit guard: notification rows are committed before Pusher fires.
 * Without this the client refetches the list while the row is still in an open
 * transaction and gets stale data, overwriting the optimistic badge increment.
 * When no transaction is active, afterCommit() runs immediately.
 *
 * The same CustomAnnouncementNotification instance is reused across the loop —
 * it is stateless (title/body only) so sharing is safe and avoids repeated allocation.
 */
class CustomNotificationService
{
    public function send(CustomNotificationDTO $dto, User $admin): CustomNotification
    {
        return DB::transaction(function () use ($dto, $admin): CustomNotification {
            $recipients = $this->resolveRecipients($dto);

            $record = CustomNotification::create([
                'title'            => $dto->title,
                'body'             => $dto->body,
                'target_type'      => $dto->targetType->value,
                'target_user_id'   => $dto->targetType === CustomNotificationTargetType::Single
                    ? $recipients->first()?->id
                    : null,
                'created_by'       => $admin->id,
                'recipients_count' => $recipients->count(),
                'sent_at'          => now(),
            ]);

            DB::afterCommit(function () use ($recipients, $dto): void {
                $notification = new CustomAnnouncementNotification($dto->title, $dto->body);

                foreach ($recipients as $user) {
                    $user->notify($notification);
                    event(new UserNotificationReceived($user));
                }
            });

            return $record;
        });
    }

    /**
     * @return Collection<int, User>
     */
    private function resolveRecipients(CustomNotificationDTO $dto): Collection
    {
        if ($dto->targetType === CustomNotificationTargetType::Single) {
            return User::where('email', $dto->userEmail)->limit(1)->get();
        }

        return User::where('is_admin', false)
            ->where('status', UserStatusEnum::Active->value)
            ->get();
    }
}
