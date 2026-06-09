<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\DTOs\PaymentIntentDTO;
use App\Models\AppSetting;

/**
 * Principle: SRP — non-Stripe adapter that resolves a QR image from AppSetting.
 * Principle: DIP — implements PaymentGatewayInterface; swappable via AppServiceProvider.
 * Principle: OCP — new QR source = new adapter; this class never modified.
 *
 * In global_qr mode: returns the admin-uploaded QR image URL immediately.
 * In manual_qr mode: returns empty qrImageUrl; admin uploads per-payment via admin API.
 *
 * retrievePaymentIntentStatus() throws — callers must guard with stripe_intent_id null check.
 */
class PromptPayPaymentService implements PaymentGatewayInterface
{
    public function createPromptPayIntent(
        int    $amountSatangs,
        string $email,
        string $idempotencyKey,
    ): PaymentIntentDTO {
        return new PaymentIntentDTO(
            stripeIntentId: '',
            clientSecret:   '',
            qrImageUrl:     AppSetting::getPromptPayQrImageUrl() ?? '',
            qrData:         '',
            stripePayload:  [],
            expiresAt:      null,
        );
    }

    public function retrievePaymentIntentStatus(string $stripeIntentId): string
    {
        // Non-Stripe mode has no external status to query.
        // PaymentService::syncWithStripe() guards on stripe_intent_id !== null before calling this.
        throw new \LogicException('PromptPayPaymentService does not support Stripe status queries.');
    }
}
