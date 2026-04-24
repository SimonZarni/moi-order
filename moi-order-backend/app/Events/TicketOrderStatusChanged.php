<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\TicketOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a ticket order's status has changed.
 * Fired from domain methods (markProcessing, markCompleted) after each transition.
 */
class TicketOrderStatusChanged
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly TicketOrder $order,
    ) {}
}
