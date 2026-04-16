<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\TicketOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a ticket order's payment was confirmed by Stripe.
 * Fired inside DB::transaction to guarantee atomicity.
 */
class TicketOrderPaymentConfirmed
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly TicketOrder $ticketOrder,
    ) {}
}
