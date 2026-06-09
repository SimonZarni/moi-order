<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * Principle: SRP — pure data carrier for a payment intent, Stripe or QR-based.
 * Principle: Immutability — readonly; no business logic.
 * stripeIntentId/clientSecret are empty strings for non-Stripe adapters.
 * qrImageUrl is populated by PromptPayPaymentService for global_qr mode.
 * expiresAt is null for non-Stripe adapters (manual confirmation, no TTL).
 */
readonly class PaymentIntentDTO
{
    public function __construct(
        public string              $stripeIntentId,
        public string              $clientSecret,
        public string              $qrImageUrl,
        public string              $qrData,
        public array               $stripePayload,
        public ?\DateTimeImmutable $expiresAt = null,
    ) {}

    public function isStripe(): bool
    {
        return $this->stripeIntentId !== '';
    }
}
