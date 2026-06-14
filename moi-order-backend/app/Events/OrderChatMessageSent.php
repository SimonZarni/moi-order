<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\FileStorageInterface;
use App\Models\OrderChatMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderChatMessageSent implements ShouldBroadcastNow
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
        // ShouldBroadcastNow fires synchronously in the same process, so I/O here is safe.
        // Signed URL TTL matches OrderChatMessageResource (30 min).
        $imageUrl = null;
        if ($this->message->image_path !== null) {
            $imageUrl = app(FileStorageInterface::class)->temporaryUrl($this->message->image_path, 1800);
        }

        return [
            'id'                   => $this->message->id,
            'sender_type'          => $this->message->sender_type,
            'sender_id'            => $this->message->sender_id,
            'sender_name'          => $this->message->sender_name,
            'body'                 => $this->message->body,
            'image_url'            => $imageUrl,
            'read_at'              => $this->message->read_at?->toIso8601String(),
            'reply_to_id'          => $this->message->reply_to_id,
            'reply_to_body'        => $this->message->reply_to_body,
            'reply_to_sender_name' => $this->message->reply_to_sender_name,
            'created_at'           => $this->message->created_at?->toIso8601String(),
        ];
    }
}
