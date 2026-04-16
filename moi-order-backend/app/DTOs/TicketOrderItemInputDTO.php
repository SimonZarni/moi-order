<?php

declare(strict_types=1);

namespace App\DTOs;

readonly class TicketOrderItemInputDTO
{
    public function __construct(
        public int $variantId,
        public int $quantity,
    ) {}
}
