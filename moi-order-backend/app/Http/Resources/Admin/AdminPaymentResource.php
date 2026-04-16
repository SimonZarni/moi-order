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
            'submission'       => $this->when(
                $this->relationLoaded('submission') && $this->submission !== null,
                fn () => [
                    'id'   => $this->submission->id,
                    'user' => $this->when(
                        $this->submission->relationLoaded('user') && $this->submission->user !== null,
                        fn () => [
                            'id'    => $this->submission->user->id,
                            'name'  => $this->submission->user->name,
                            'email' => $this->submission->user->email,
                        ]
                    ),
                ]
            ),
        ];
    }
}
