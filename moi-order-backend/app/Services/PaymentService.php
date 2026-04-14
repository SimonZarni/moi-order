<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\PaymentStatus;
use App\Enums\SubmissionStatus;
use App\Events\PaymentConfirmed;
use App\Models\Payment;
use App\Models\ServiceSubmission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Principle: SRP — owns payment creation business logic only.
 * Principle: DIP — depends on PaymentGatewayInterface; never on StripePaymentService directly.
 * Security: idempotency_key prevents duplicate Stripe intents on retry.
 *   Stripe is called BEFORE the DB write: if the DB fails, the next retry returns the
 *   same Stripe intent via Stripe's own idempotency key mechanism.
 */
class PaymentService
{
    public function __construct(
        private readonly PaymentGatewayInterface $gateway,
    ) {}

    /**
     * Query Stripe directly for the PaymentIntent status and apply any state change.
     * Called by the client when it returns to the foreground — fallback for missed webhooks.
     * Mirrors the webhook handler logic so events/listeners fire identically.
     */
    public function syncWithStripe(ServiceSubmission $submission): void
    {
        $submission->loadMissing('payment');
        $payment = $submission->payment;

        if ($payment === null || $payment->status->isTerminal()) {
            return; // Nothing to sync — already in a terminal state.
        }

        $stripeStatus = $this->gateway->retrievePaymentIntentStatus($payment->stripe_intent_id);

        Log::info('payment.sync.stripe_status', [
            'payment_id'    => $payment->id,
            'stripe_status' => $stripeStatus,
        ]);

        if ($stripeStatus === 'succeeded') {
            DB::transaction(function () use ($payment): void {
                $locked = Payment::with('submission')
                    ->where('id', $payment->id)
                    ->lockForUpdate()
                    ->first();

                if ($locked === null || $locked->status->isTerminal()) {
                    return; // Idempotent — webhook may have already processed it.
                }

                $locked->markSucceeded([]);

                Log::info('payment.sync.confirmed', ['payment_id' => $locked->id]);

                event(new PaymentConfirmed($locked->submission));
            });

            return;
        }

        if (in_array($stripeStatus, ['canceled', 'payment_failed'], true)) {
            DB::transaction(function () use ($payment, $submission): void {
                $locked = Payment::where('id', $payment->id)
                    ->lockForUpdate()
                    ->first();

                if ($locked === null || $locked->status->isTerminal()) {
                    return;
                }

                $locked->markFailed([]);
                $submission->markPaymentFailed();

                Log::info('payment.sync.failed', ['payment_id' => $locked->id]);
            });
        }
    }

    /**
     * Return the active pending payment, or create a new one.
     * Handles first-time creation and retry after failure.
     */
    public function createForSubmission(ServiceSubmission $submission): Payment
    {
        // Idempotency: if there is already a pending payment, return it.
        $existing = Payment::where('submission_id', $submission->id)
            ->where('status', PaymentStatus::Pending)
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        $idempotencyKey = Str::uuid()->toString();

        // price_snapshot is stored in whole THB; Stripe requires satangs (×100).
        $submission->loadMissing('user');
        $dto = $this->gateway->createPromptPayIntent(
            $submission->price_snapshot * 100,
            $submission->user->email,
            $idempotencyKey,
        );

        return DB::transaction(function () use ($submission, $dto, $idempotencyKey): Payment {
            // Reset submission to pending_payment on a retry (was payment_failed).
            if ($submission->status === SubmissionStatus::PaymentFailed) {
                $submission->update(['status' => SubmissionStatus::PendingPayment]);
            }

            return Payment::create([
                'submission_id'    => $submission->id,
                'stripe_intent_id' => $dto->stripeIntentId,
                'amount'           => $submission->price_snapshot,
                'currency'         => 'thb',
                'status'           => PaymentStatus::Pending,
                'qr_image_url'     => $dto->qrImageUrl,
                'stripe_payload'   => $dto->stripePayload,
                'idempotency_key'  => $idempotencyKey,
            ]);
        });
    }
}
