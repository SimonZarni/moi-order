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
 * Principle: SRP — sole responsibility is the real-time Pusher ping that tells
 *   the mobile client a new notification row exists.
 *
 * ShouldBroadcastNow bypasses the queue and pushes to Pusher synchronously
 * within the same request. This is intentional: the notification database row
 * is already committed (DB::afterCommit guard in the listener), so the client
 * can safely refetch and will see the new row immediately.
 *
 * The notification classes (SubmissionStatusNotification, TicketOrderStatusNotification)
 * use only the 'database' channel — this event owns the broadcast side exclusively,
 * preventing duplicate Pusher events if a queue worker is also running.
 */
class UserNotificationReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('App.Models.User.' . $this->user->id)];
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
        return [];
    }
}
