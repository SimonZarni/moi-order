<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\TicketOrder;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — records one fact: a new ticket order was created by a user.
 * Dispatched AFTER the DB::transaction commits in TicketOrderService::create(),
 * and only for genuinely new orders (not UniqueConstraintViolation duplicates).
 */
class TicketOrderCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly TicketOrder $order,
    ) {}
}
