<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes payment HTTP response only.
 * Security: stripe_payload and idempotency_key never exposed (internal audit fields).
 *   client_secret not exposed — mobile app uses QR image URL directly.
 * Bank info only included when a QR image is present (PromptPay image modes).
 * qr_image_url may be a Stripe-hosted full URL or a storage path — resolved here.
 */
class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $hasQrImage = $this->qr_image_url !== null;
        $qrImageUrl = $this->resolveQrImageUrl($this->qr_image_url);

        return [
            'id'                  => $this->uuid,
            'status'              => $this->status->value,
            'status_label'        => $this->status->label(),
            'amount'              => $this->amount,
            'currency'            => $this->currency,
            'qr_image_url'        => $qrImageUrl,
            'qr_data'             => $this->qr_data,
            'expires_at'          => $this->expires_at?->toISOString(),
            'bank_name'           => $hasQrImage ? AppSetting::getPromptPayBankName() : null,
            'bank_account_number' => $hasQrImage ? AppSetting::getPromptPayBankAccountNumber() : null,
            'bank_account_name'   => $hasQrImage ? AppSetting::getPromptPayBankAccountName() : null,
        ];
    }

    private function resolveQrImageUrl(?string $raw): ?string
    {
        if ($raw === null) {
            return null;
        }
        // Stripe/external URLs are already full https:// links — serve as-is.
        if (str_starts_with($raw, 'http')) {
            return $raw;
        }
        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);
        return $storage->publicUrl($raw);
    }
}
