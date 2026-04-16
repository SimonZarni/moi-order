<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TicketOrderPaymentConfirmed;

/**
 * Principle: SRP — one reaction: move ticket order to Processing on payment confirmation.
 * Synchronous: runs inside the same DB::transaction as markSucceeded, keeping payment
 *   status and order status atomically consistent.
 * markProcessing() is idempotent — safe against duplicate webhook delivery.
 */
class MarkTicketOrderProcessing
{
    public function handle(TicketOrderPaymentConfirmed $event): void
    {
        $event->ticketOrder->markProcessing();
    }
}
