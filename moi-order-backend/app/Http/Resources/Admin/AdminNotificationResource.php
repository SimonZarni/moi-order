<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes one admin notification row for the API response.
 * Sensitive fields never present. Exposes all payload data needed for
 * frontend navigation (submission_id / ticket_order_id).
 */
class AdminNotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'type'       => $this->data['notification_type'] ?? 'unknown',
            'title'      => $this->data['title'] ?? '',
            'body'       => $this->data['body'] ?? '',
            'data'       => $this->data,
            'is_read'    => $this->read_at !== null,
            'created_at' => $this->created_at->toISOString(),
            'time_ago'   => $this->created_at->diffForHumans(),
        ];
    }
}
