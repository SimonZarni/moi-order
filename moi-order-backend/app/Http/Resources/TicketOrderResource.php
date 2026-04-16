<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes ticket order HTTP response only.
 * Security: eticket_path (internal storage path) never exposed; a signed URL endpoint exists separately.
 */
class TicketOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'status'       => $this->status->value,
            'status_label' => $this->status->label(),
            'visit_date'   => $this->visit_date->toDateString(),
            'total'        => $this->when(
                $this->relationLoaded('items'),
                fn () => $this->getPayableAmountThb(),
            ),
            'completed_at' => $this->completed_at?->toISOString(),
            'created_at'   => $this->created_at->toISOString(),
            'has_eticket'  => $this->eticket_path !== null,
            'ticket'       => $this->when(
                $this->relationLoaded('ticket'),
                fn () => [
                    'id'   => $this->ticket->id,
                    'name' => $this->ticket->name,
                ],
            ),
            'items'        => $this->when(
                $this->relationLoaded('items'),
                fn () => TicketOrderItemResource::collection($this->items),
            ),
            'payment'      => $this->when(
                $this->relationLoaded('payment') && $this->payment !== null,
                fn () => new PaymentResource($this->payment),
            ),
        ];
    }
}
