<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Webhook;

use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

/**
 * Principle: SRP — handles Stripe webhook events only.
 * Security: Stripe-Signature header verified before processing any payload.
 *   Idempotency: lockForUpdate() inside transaction prevents duplicate webhook processing.
 *   Returns 200 always after signature check — prevents Stripe retry storms on app errors.
 * No auth middleware: Stripe cannot send auth tokens; signature IS the auth.
 */
class StripeWebhookController extends Controller
{
    public function handle(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature', '');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.webhook_secret'),
            );
        } catch (SignatureVerificationException) {
            Log::warning('stripe.webhook.invalid_signature', ['ip' => $request->ip()]);
            return response()->json(['message' => 'Invalid signature', 'code' => 'invalid_signature'], 400);
        }

        $intentId = $event->data->object->id ?? null;

        if ($intentId === null) {
            return response()->json(['received' => true]);
        }

        match ($event->type) {
            'payment_intent.succeeded'      => $this->handleSucceeded($intentId, (array) $event->data->object),
            'payment_intent.payment_failed' => $this->handleFailed($intentId, (array) $event->data->object),
            default                         => null,
        };

        return response()->json(['received' => true]);
    }

    // ─── Private handlers ─────────────────────────────────────────────────────

    private function handleSucceeded(string $intentId, array $stripePayload): void
    {
        DB::transaction(function () use ($intentId, $stripePayload): void {
            $payment = Payment::with('payable')
                ->where('stripe_intent_id', $intentId)
                ->lockForUpdate()
                ->first();

            if ($payment === null || $payment->status->isTerminal()) {
                return; // Already processed or unknown intent — idempotent return.
            }

            $payment->markSucceeded($stripePayload);

            Log::info('stripe.webhook.payment_succeeded', ['payment_id' => $payment->id]);

            $payment->payable->onPaymentConfirmed();
        });
    }

    private function handleFailed(string $intentId, array $stripePayload): void
    {
        DB::transaction(function () use ($intentId, $stripePayload): void {
            $payment = Payment::with('payable')
                ->where('stripe_intent_id', $intentId)
                ->lockForUpdate()
                ->first();

            if ($payment === null || $payment->status->isTerminal()) {
                return;
            }

            $payment->markFailed($stripePayload);
            $payment->payable->onPaymentFailed();

            Log::info('stripe.webhook.payment_failed', ['payment_id' => $payment->id]);
        });
    }
}
