<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\PaymentIntentDTO;

/**
 * Principle: ISP — payment gateway contract is separate from webhook handling.
 * Principle: DIP — callers depend on this abstraction; never on StripePaymentService directly.
 * Principle: OCP — new payment providers (Omise, Adyen) add a new Adapter only.
 */
interface PaymentGatewayInterface
{
    /**
     * Create a PromptPay PaymentIntent and confirm it immediately.
     * Returns the QR code data needed to display to the user.
     *
     * @param  int    $amountSatangs  Amount in satangs (THB smallest unit).
     * @param  string $idempotencyKey Caller-supplied key to prevent duplicate intents.
     */
    public function createPromptPayIntent(int $amountSatangs, string $email, string $idempotencyKey): PaymentIntentDTO;
}
