<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderChatMessageResource extends JsonResource
{
    public function __construct($resource, private readonly ?FileStorageInterface $storage = null)
    {
        parent::__construct($resource);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'sender_type'          => $this->sender_type,
            'sender_id'            => $this->sender_id,
            'sender_name'          => $this->sender_name,
            'body'                 => $this->body,
            'image_url'            => $this->image_path !== null && $this->storage !== null
                ? $this->storage->url($this->image_path)
                : null,
            'read_at'              => $this->read_at?->toIso8601String(),
            'reply_to_id'          => $this->reply_to_id,
            'reply_to_body'        => $this->reply_to_body,
            'reply_to_sender_name' => $this->reply_to_sender_name,
            'created_at'           => $this->created_at?->toIso8601String(),
        ];
    }
}
