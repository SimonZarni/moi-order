<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketOrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'quantity'       => $this->quantity,
            'price_snapshot' => $this->price_snapshot,
            'subtotal'       => $this->subtotalThb(),
            'variant'        => $this->when(
                $this->relationLoaded('variant'),
                fn () => [
                    'id'   => $this->variant->id,
                    'name' => $this->variant->name,
                ],
            ),
        ];
    }
}
