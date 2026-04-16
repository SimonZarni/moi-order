<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\CreateTicketOrderRequest;

readonly class CreateTicketOrderDTO
{
    /** @param TicketOrderItemInputDTO[] $items */
    public function __construct(
        public int    $ticketId,
        public string $visitDate,
        public string $idempotencyKey,
        public array  $items,
    ) {}

    public static function fromRequest(CreateTicketOrderRequest $request): self
    {
        $items = array_map(
            fn (array $item) => new TicketOrderItemInputDTO(
                variantId: (int) $item['ticket_variant_id'],
                quantity:  (int) $item['quantity'],
            ),
            $request->validated('items'),
        );

        return new self(
            ticketId:       (int) $request->validated('ticket_id'),
            visitDate:      $request->validated('visit_date'),
            idempotencyKey: $request->validated('idempotency_key'),
            items:          $items,
        );
    }
}
