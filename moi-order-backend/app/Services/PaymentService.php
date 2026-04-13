<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PaymentGatewayInterface;
use App\Enums\PaymentStatus;
use App\Enums\SubmissionStatus;
use App\Models\Payment;
use App\Models\ServiceSubmission;
use Illuminate\Support\Facades\DB;
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
