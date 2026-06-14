<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderChatMessagesRead implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /** @param list<int> $messageIds IDs of messages that were marked as read */
    public function __construct(
        public readonly string $orderUuid,
        public readonly string $readerType,
        public readonly array  $messageIds,
        public readonly string $readAt,
    ) {}

    public function broadcastOn(): Channel
    {
        return new PrivateChannel("order.{$this->orderUuid}");
    }

    public function broadcastAs(): string
    {
        return 'chat.messages-read';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'reader_type' => $this->readerType,
            'message_ids' => $this->messageIds,
            'read_at'     => $this->readAt,
        ];
    }
}
