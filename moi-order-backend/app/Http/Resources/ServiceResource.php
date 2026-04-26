<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the service catalog HTTP response only.
 * Principle: Security — is_active and deleted_at never exposed.
 *   types only included when explicitly loaded (whenLoaded prevents N+1).
 */
class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                     => $this->id,
            'name'                   => $this->name,
            'name_en'                => $this->name_en,
            'name_mm'                => $this->name_mm,
            'slug'                   => $this->slug,
            'service_category_slug'  => $this->serviceCategory?->slug,
            'types'                  => ServiceTypeResource::collection($this->whenLoaded('types')),
        ];
    }
}
