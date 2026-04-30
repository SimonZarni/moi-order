<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FoodOrderItemResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'menu_item_id'   => $this->menu_item_id,
            'name'           => $this->name,
            'price_cents'    => $this->price_cents,
            'quantity'       => $this->quantity,
            'notes'          => $this->notes,
            'subtotal_cents' => $this->subtotal_cents,
        ];
    }
}
