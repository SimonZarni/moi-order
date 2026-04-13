<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes payment HTTP response only.
 * Security: stripe_payload and idempotency_key never exposed (internal audit fields).
 *   client_secret not exposed — mobile app uses QR image URL directly.
 */
class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'status'       => $this->status->value,
            'status_label' => $this->status->label(),
            'amount'       => $this->amount,
            'currency'     => $this->currency,
            'qr_image_url' => $this->qr_image_url,
            'expires_at'   => $this->expires_at?->toISOString(),
        ];
    }
}
