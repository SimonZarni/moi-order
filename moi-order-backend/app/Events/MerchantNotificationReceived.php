<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\MerchantNotification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — real-time ping for the merchant notification bell.
 *
 * Reuses the existing private-merchant.{merchantId} channel already authorised
 * in routes/channels.php, keeping the number of channels minimal.
 *
 * ShouldBroadcastNow: the MerchantNotification row is already committed before
 * this event fires (dispatched inside DB::afterCommit in the listener), so the
 * app refetches and is guaranteed to see the new row immediately.
 */
class MerchantNotificationReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly MerchantNotification $notification,
    ) {}

    /** @return array<int, PrivateChannel> */
    public function broadcastOn(): array
    {
        return [new PrivateChannel("merchant.{$this->notification->merchant_id}")];
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'id'         => $this->notification->id,
            'type'       => $this->notification->type,
            'title'      => $this->notification->title,
            'body'       => $this->notification->body,
            'order_id'   => $this->notification->order_id,
            'is_read'    => false,
            'created_at' => $this->notification->created_at?->toIso8601String(),
        ];
    }
}
