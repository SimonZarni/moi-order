<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: Security — stripe_payload and idempotency_key never exposed.
 *   stripe_intent_id exposed for admin reconciliation purposes only.
 */
class AdminPaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'status'           => $this->status->value,
            'status_label'     => $this->status->label(),
            'amount'           => $this->amount,
            'currency'         => $this->currency,
            'stripe_intent_id' => $this->stripe_intent_id,
            'qr_image_url'     => $this->qr_image_url,
            'expires_at'       => $this->expires_at?->toISOString(),
            'created_at'       => $this->created_at->toISOString(),
            'payable_type' => $this->payable_type,
            'payable_id'   => $this->payable_id,
            'payable'      => $this->when(
                $this->relationLoaded('payable') && $this->payable !== null,
                fn () => [
                    'id'   => $this->payable->getKey(),
                    'type' => class_basename($this->payable_type),
                ]
            ),
        ];
    }
}
