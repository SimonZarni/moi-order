<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Enums\CustomNotificationTargetType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes a single CustomNotification record for the admin web response.
 * Security: exposes only safe summary fields; never leaks full user objects.
 */
class AdminCustomNotificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'body'              => $this->body,
            'target_type'       => $this->target_type->value,
            'target_user_email' => $this->target_type === CustomNotificationTargetType::Single
                ? $this->whenLoaded('targetUser', fn () => $this->targetUser?->email)
                : null,
            'recipients_count'  => $this->recipients_count,
            'sent_by'           => $this->whenLoaded('createdBy', fn () => $this->createdBy?->name),
            'sent_at'           => $this->sent_at->toIso8601String(),
        ];
    }
}
