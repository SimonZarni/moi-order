<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'name'        => $this->name,
            'name_en'     => $this->name_en,
            'name_mm'     => $this->name_mm,
            'slug'        => $this->slug,
            'is_active'   => $this->is_active,
            'types_count' => $this->types_count ?? null,
            'created_at'  => $this->created_at->toISOString(),
            'deleted_at'  => $this->deleted_at?->toISOString(),
        ];
    }
}
