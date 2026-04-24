<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — serialises a single DatabaseNotification for the mobile client.
 * Security: only exposes fields the client needs; never leaks raw PHP class names.
 */
class NotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var array<string, mixed> $data */
        $data = $this->data ?? [];

        return [
            'id'         => $this->id,
            'type'       => $data['notification_type'] ?? 'unknown',
            'title'      => $data['title'] ?? '',
            'body'       => $data['body'] ?? '',
            'data'       => array_filter([
                'submission_id'   => $data['submission_id'] ?? null,
                'ticket_order_id' => $data['ticket_order_id'] ?? null,
            ], fn (mixed $v): bool => $v !== null),
            'read_at'    => $this->read_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
