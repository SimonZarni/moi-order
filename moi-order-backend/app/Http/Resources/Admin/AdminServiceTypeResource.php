<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminServiceTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'service_id'   => $this->service_id,
            'name'         => $this->name,
            'name_en'      => $this->name_en,
            'name_mm'      => $this->name_mm,
            'price'        => $this->price,
            'is_active'    => $this->is_active,
            'field_schema' => $this->field_schema ?? [],
            'created_at'   => $this->created_at->toISOString(),
            'deleted_at'   => $this->deleted_at?->toISOString(),
        ];
    }
}
