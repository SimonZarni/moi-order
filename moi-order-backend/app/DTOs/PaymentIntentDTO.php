<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * Principle: SRP — pure data carrier for a created Stripe PromptPay intent.
 * Principle: Immutability — readonly; no business logic.
 */
readonly class PaymentIntentDTO
{
    public function __construct(
        public string $stripeIntentId,
        public string $clientSecret,
        public string $qrImageUrl,
        public array  $stripePayload,
    ) {}
}
