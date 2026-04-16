<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\DTOs\PaymentIntentDTO;
use Stripe\StripeClient;

/**
 * Principle: SRP — wraps the Stripe SDK only; zero business logic.
 * Principle: DIP — implements PaymentGatewayInterface; never imported directly outside AppServiceProvider.
 * Principle: OCP — swap for OmisePaymentService by rebinding the interface; zero code changes elsewhere.
 * Security: API key sourced from config('services.stripe.secret') — never hardcoded.
 */
class StripePaymentService implements PaymentGatewayInterface
{
    public function __construct(
        private readonly StripeClient $stripe,
    ) {}

    public function retrievePaymentIntentStatus(string $stripeIntentId): string
    {
        $intent = $this->stripe->paymentIntents->retrieve($stripeIntentId);

        return $intent->status;
    }

    public function createPromptPayIntent(int $amountSatangs, string $email, string $idempotencyKey): PaymentIntentDTO
    {
        $intent = $this->stripe->paymentIntents->create(
            [
                'amount'               => $amountSatangs,
                'currency'             => 'thb',
                'payment_method_types' => ['promptpay'],
                'payment_method_data'  => [
                    'type'            => 'promptpay',
                    'billing_details' => ['email' => $email],
                ],
                'confirm'              => true,
            ],
            ['idempotency_key' => $idempotencyKey],
        );

        $qrImageUrl = $intent->next_action?->promptpay_display_qr_code?->image_url_png ?? '';

        $expiresAtTs = $intent->next_action?->promptpay_display_qr_code?->expires_at ?? null;
        $expiresAt   = $expiresAtTs !== null
            ? (new \DateTimeImmutable())->setTimestamp((int) $expiresAtTs)
            : null;

        return new PaymentIntentDTO(
            stripeIntentId: $intent->id,
            clientSecret:   $intent->client_secret,
            qrImageUrl:     $qrImageUrl,
            stripePayload:  $intent->toArray(),
            expiresAt:      $expiresAt,
        );
    }
}
