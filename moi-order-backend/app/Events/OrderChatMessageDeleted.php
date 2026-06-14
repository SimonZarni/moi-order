<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderChatMessageDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $orderUuid,
        public readonly int    $messageId,
    ) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel("order.{$this->orderUuid}");
    }

    public function broadcastAs(): string
    {
        return 'chat.message-deleted';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return ['message_id' => $this->messageId];
    }
}
