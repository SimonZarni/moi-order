<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\TicketOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a ticket order's payment was successfully
 *   processed AND the status transition to Processing was committed.
 *
 * Fired from inside the lockForUpdate block in TicketOrder::markProcessing().
 * Exactly-once guarantee: the lock ensures only one thread completes the status
 * transition — mirroring the deduplication on SubmissionPaymentProcessed.
 */
class TicketOrderPaymentProcessed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly TicketOrder $ticketOrder,
    ) {}
}
