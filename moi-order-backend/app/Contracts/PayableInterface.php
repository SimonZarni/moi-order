<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Principle: ISP — only methods the PaymentService needs; no Eloquent leakage.
 * Principle: OCP — new payable types (hotels, tours) implement this without touching PaymentService.
 * Principle: LSP — all implementors must satisfy every method contract.
 */
interface PayableInterface
{
    /** Amount in whole THB, stored on the Payment record. */
    public function getPayableAmountThb(): int;

    /** Amount in satangs (THB × 100) for the Stripe API. */
    public function getPayableAmountSatangs(): int;

    /** Email address used as billing contact for the Stripe intent. */
    public function getPayableUserEmail(): string;

    /** Dispatch the domain event appropriate to this payable type on payment success. */
    public function onPaymentConfirmed(): void;

    /** Apply the payment-failed state transition for this payable type. */
    public function onPaymentFailed(): void;

    /** Reset from payment_failed back to pending_payment when the user retries. */
    public function resetForPaymentRetry(): void;
}
