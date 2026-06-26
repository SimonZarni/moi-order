<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'is_active'   => $this->is_active,
            'name'        => $this->name,
            'description' => $this->description,
            'adult_price' => $this->adult_price,
            'child_price' => $this->child_price,
            'sort_order'  => $this->sort_order,
        ];
    }
}
