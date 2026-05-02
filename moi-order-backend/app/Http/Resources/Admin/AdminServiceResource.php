<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

// Principle: OCP — types are optionally embedded via whenLoaded; callers eager-load as needed.

class AdminServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'name_en'               => $this->name_en,
            'name_mm'               => $this->name_mm,
            'slug'                  => $this->slug,
            'position'              => $this->position,
            'is_active'             => $this->is_active,
            'service_category_id'   => $this->service_category_id,
            'service_category_slug' => $this->serviceCategory?->slug,
            'types_count'           => $this->types_count ?? null,
            'types'                 => AdminServiceTypeResource::collection($this->whenLoaded('types')),
            'created_at'            => $this->created_at->toISOString(),
            'deleted_at'            => $this->deleted_at?->toISOString(),
        ];
    }
}
