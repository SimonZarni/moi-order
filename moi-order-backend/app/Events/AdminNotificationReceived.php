<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — real-time ping for admin-only notifications exclusively.
 *
 * Broadcasts on a dedicated admin channel (App.Admin.User.{uuid}) that is
 * separate from the user-facing channel (App.Models.User.{uuid}). This
 * ensures the mobile app never receives signals for admin notifications,
 * regardless of whether the user also holds an admin role on the same account.
 *
 * ShouldBroadcastNow: same rationale as UserNotificationReceived — the DB row
 * is already committed before this event fires, so the admin dashboard can
 * safely refetch and will see the new row immediately.
 */
class AdminNotificationReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly string $notificationType = '',
    ) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('App.Admin.User.' . $this->user->uuid)];
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return ['notification_type' => $this->notificationType];
    }
}
