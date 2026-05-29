<?php

declare(strict_types=1);

namespace App\Http\Resources\Merchant;

use App\Models\MerchantNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes a single MerchantNotification for the API response.
 * Principle: Security — never exposes merchant_id, deleted_at, or internal fields.
 *
 * @mixin MerchantNotification
 */
class MerchantNotificationResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'type'       => $this->type,
            'title'      => $this->title,
            'body'       => $this->body,
            'order_id'   => $this->order_id,
            'is_read'    => $this->read_at !== null,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
