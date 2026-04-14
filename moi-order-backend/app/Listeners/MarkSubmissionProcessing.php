<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\PaymentConfirmed;

/**
 * Principle: SRP — one reaction: move submission to Processing on payment confirmation.
 * Synchronous (no ShouldQueue): runs inside the same DB::transaction as markSucceeded,
 *   keeping the payment status and submission status atomically consistent.
 *   markProcessing() is idempotent — safe against duplicate webhook delivery.
 */
class MarkSubmissionProcessing
{
    public function handle(PaymentConfirmed $event): void
    {
        // Tell-Don't-Ask: domain method owns the guard and transition.
        $event->submission->markProcessing();
    }
}
