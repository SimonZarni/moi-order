<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PayableInterface;
use App\Contracts\PaymentGatewayInterface;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Principle: SRP — owns payment creation business logic only.
 * Principle: DIP — depends on PaymentGatewayInterface and PayableInterface; never on concrete models.
 * Principle: OCP — new payable types (TicketOrder, hotel bookings) need zero changes here.
 * Security: idempotency_key prevents duplicate Stripe intents on retry.
 *   Stripe is called BEFORE the DB write: if the DB fails, the next retry returns the
 *   same Stripe intent via Stripe's own idempotency key mechanism.
 *   Expired payments are skipped — a fresh intent is created to avoid presenting stale QR codes.
 */
class PaymentService
{
    public function __construct(
        private readonly PaymentGatewayInterface $gateway,
    ) {}

    /**
     * Query Stripe directly for the PaymentIntent status and apply any state change.
     * Called by the client when it returns to the foreground — fallback for missed webhooks.
     *
     * @param PayableInterface&Model $payable
     */
    public function syncWithStripe(PayableInterface&Model $payable): void
    {
        $payable->loadMissing('payment');
        $payment = $payable->payment;

        if ($payment === null || $payment->status->isTerminal()) {
            return;
        }

        $stripeStatus = $this->gateway->retrievePaymentIntentStatus($payment->stripe_intent_id);

        Log::info('payment.sync.stripe_status', [
            'payment_id'    => $payment->id,
            'stripe_status' => $stripeStatus,
        ]);

        if ($stripeStatus === 'succeeded') {
            DB::transaction(function () use ($payment, $payable): void {
                $locked = Payment::with('payable')
                    ->where('id', $payment->id)
                    ->lockForUpdate()
                    ->first();

                if ($locked === null || $locked->status->isTerminal()) {
                    return;
                }

                $locked->markSucceeded([]);

                Log::info('payment.sync.confirmed', ['payment_id' => $locked->id]);

                $payable->onPaymentConfirmed();
            });

            return;
        }

        if (in_array($stripeStatus, ['canceled', 'payment_failed'], true)) {
            DB::transaction(function () use ($payment, $payable): void {
                $locked = Payment::where('id', $payment->id)
                    ->lockForUpdate()
                    ->first();

                if ($locked === null || $locked->status->isTerminal()) {
                    return;
                }

                $locked->markFailed([]);
                $payable->onPaymentFailed();

                Log::info('payment.sync.failed', ['payment_id' => $locked->id]);
            });
        }
    }

    /**
     * Return the active non-expired pending payment, or create a new one.
     * Handles first-time creation and retry after failure or expiry.
     *
     * @param PayableInterface&Model $payable
     */
    public function createForPayable(PayableInterface&Model $payable): Payment
    {
        // Idempotency: if there is already a non-expired pending payment, return it.
        // An expired payment falls through so a fresh intent is created.
        $existing = Payment::where('payable_type', $payable->getMorphClass())
            ->where('payable_id', $payable->getKey())
            ->where('status', PaymentStatus::Pending)
            ->where(function ($q): void {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        $idempotencyKey = Str::uuid()->toString();

        $dto = $this->gateway->createPromptPayIntent(
            $payable->getPayableAmountSatangs(),
            $payable->getPayableUserEmail(),
            $idempotencyKey,
        );

        return DB::transaction(function () use ($payable, $dto, $idempotencyKey): Payment {
            // Reset payable to pending_payment on a retry (was payment_failed).
            $payable->resetForPaymentRetry();

            return Payment::create([
                'payable_type'     => $payable->getMorphClass(),
                'payable_id'       => $payable->getKey(),
                'stripe_intent_id' => $dto->stripeIntentId,
                'amount'           => $payable->getPayableAmountThb(),
                'currency'         => 'thb',
                'status'           => PaymentStatus::Pending,
                'qr_image_url'     => $dto->qrImageUrl,
                'stripe_payload'   => $dto->stripePayload,
                'idempotency_key'  => $idempotencyKey,
                'expires_at'       => $dto->expiresAt,
            ]);
        });
    }
}
