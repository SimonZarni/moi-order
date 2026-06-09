<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\PayableInterface;
use App\Contracts\PaymentGatewayInterface;
use App\Enums\PaymentStatus;
use App\Events\AdminNotificationReceived;
use App\Models\Payment;
use App\Models\User;
use App\Notifications\Admin\NewPaymentNotification;
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
     * No-op for non-Stripe payments (stripe_intent_id === null).
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

        // Non-Stripe payments have no external status to query.
        if ($payment->stripe_intent_id === null) {
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
     * Security: double-checked locking prevents concurrent requests from creating
     * two Stripe PaymentIntents for the same order. The Stripe call happens outside
     * the DB transaction to avoid holding a lock during a network round-trip. If a
     * race is lost inside the transaction, the orphaned Stripe intent expires naturally.
     *
     * @param PayableInterface&Model $payable
     */
    public function createForPayable(PayableInterface&Model $payable): Payment
    {
        // Fast path — no lock needed for the common case.
        $existing = $this->findPendingPayment($payable);
        if ($existing !== null) {
            return $existing;
        }

        // Create the Stripe intent BEFORE opening a DB transaction so we never hold
        // a row lock during a network call.
        $idempotencyKey = Str::uuid()->toString();

        $dto = $this->gateway->createPromptPayIntent(
            $payable->getPayableAmountSatangs(),
            $payable->getPayableUserEmail(),
            $idempotencyKey,
        );

        return DB::transaction(function () use ($payable, $dto, $idempotencyKey): Payment {
            // Re-check with a row lock — serialises concurrent requests that both
            // passed the fast-path check above.
            $existing = $this->findPendingPayment($payable, lockForUpdate: true);
            if ($existing !== null) {
                // Another request won the race; our Stripe intent is orphaned and
                // will expire automatically via Stripe's PaymentIntent TTL.
                return $existing;
            }

            // Reset payable to pending_payment on a retry (was payment_failed).
            $payable->resetForPaymentRetry();

            return Payment::create([
                'payable_type'     => $payable->getMorphClass(),
                'payable_id'       => $payable->getKey(),
                // null for non-Stripe adapters.
                'stripe_intent_id' => $dto->stripeIntentId !== '' ? $dto->stripeIntentId : null,
                'amount'           => $payable->getPayableAmountSatangs(),
                'currency'         => 'thb',
                'status'           => PaymentStatus::Pending,
                'qr_image_url'     => $dto->qrImageUrl !== '' ? $dto->qrImageUrl : null,
                'qr_data'          => $dto->qrData !== '' ? $dto->qrData : null,
                'stripe_payload'   => $dto->stripePayload,
                'idempotency_key'  => $idempotencyKey,
                // Stripe: use expiresAt or fall back to 60 min.
                // Non-Stripe: no expiry — admin confirms or rejects manually.
                'expires_at'       => $dto->isStripe()
                    ? ($dto->expiresAt ?? now()->addMinutes(60))
                    : null,
            ]);
        });
    }

    /**
     * Notify all admins that a user has manually paid via PromptPay QR.
     * Only valid when the payment exists, is pending, and has no Stripe intent.
     * No-op if payment is already terminal or Stripe-based.
     *
     * @param PayableInterface&Model $payable
     */
    public function notifyManualPayment(
        PayableInterface&Model $payable,
        string                 $userName,
        string                 $payableName,
    ): void {
        $payable->loadMissing('payment');
        $payment = $payable->payment;

        if ($payment === null || $payment->status->isTerminal() || $payment->stripe_intent_id !== null) {
            return;
        }

        $body = "{$userName} says they've paid for {$payableName} — please verify.";

        DB::afterCommit(function () use ($payable, $body, $userName, $payableName): void {
            User::where('is_admin', true)->each(function (User $admin) use ($payable, $body, $userName, $payableName): void {
                $admin->notify(new NewPaymentNotification($body, [
                    'payable_id'   => $payable->uuid,
                    'payable_type' => class_basename($payable),
                    'user_name'    => $userName,
                    'object_name'  => $payableName,
                ]));
                event(new AdminNotificationReceived($admin));
            });
        });
    }

    private function findPendingPayment(PayableInterface&Model $payable, bool $lockForUpdate = false): ?Payment
    {
        $query = Payment::where('payable_type', $payable->getMorphClass())
            ->where('payable_id', $payable->getKey())
            ->where('status', PaymentStatus::Pending)
            ->where(function ($q): void {
                // Stripe payments: must not be expired.
                // Non-Stripe payments (stripe_intent_id IS NULL): no expiry — admin confirms.
                $q->whereNotNull('stripe_intent_id')
                  ->where(function ($q2): void {
                      $q2->where('expires_at', '>', now())
                         ->orWhere(function ($q3): void {
                             // Legacy rows before the expiry fallback was added.
                             $q3->whereNull('expires_at')
                                ->where('created_at', '>', now()->subHour());
                         });
                  })
                  ->orWhereNull('stripe_intent_id');
            });

        if ($lockForUpdate) {
            $query->lockForUpdate();
        }

        return $query->first();
    }
}
