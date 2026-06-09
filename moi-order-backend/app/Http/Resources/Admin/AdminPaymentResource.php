<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Contracts\FileStorageInterface;
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
        $userName = null;
        if ($this->relationLoaded('payable') && $this->payable !== null) {
            $userName = $this->payable->user?->name;
        }

        $qrImageUrl = $this->resolveQrImageUrl($this->qr_image_url);

        return [
            'id'               => $this->uuid,
            'status'           => $this->status->value,
            'status_label'     => $this->status->label(),
            'amount'           => $this->amount,
            'currency'         => $this->currency,
            'stripe_intent_id' => $this->stripe_intent_id,
            'qr_image_url'     => $qrImageUrl,
            'qr_data'          => $this->qr_data,
            'expires_at'       => $this->expires_at?->toISOString(),
            'created_at'       => $this->created_at->toISOString(),
            'user_name'        => $userName,
            'payable'          => $this->when(
                $this->relationLoaded('payable') && $this->payable !== null,
                fn () => [
                    'id'   => $this->payable->uuid,
                    'type' => class_basename($this->payable_type),
                ]
            ),
        ];
    }

    private function resolveQrImageUrl(?string $raw): ?string
    {
        if ($raw === null) {
            return null;
        }
        if (str_starts_with($raw, 'http')) {
            return $raw;
        }
        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);
        return $storage->publicUrl($raw);
    }
}
