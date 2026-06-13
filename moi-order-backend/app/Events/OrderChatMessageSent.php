<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\OrderChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderChatMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly OrderChatMessage $message) {}

    /** @return Channel|list<Channel> */
    public function broadcastOn(): Channel|array
    {
        return new PrivateChannel("order.{$this->message->foodOrder->uuid}");
    }

    public function broadcastAs(): string
    {
        return 'chat.message-sent';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'id'          => $this->message->id,
            'sender_type' => $this->message->sender_type,
            'sender_id'   => $this->message->sender_id,
            'sender_name' => $this->message->sender_name,
            'body'        => $this->message->body,
            'image_url'   => null,
            'created_at'  => $this->message->created_at?->toIso8601String(),
        ];
    }
}
