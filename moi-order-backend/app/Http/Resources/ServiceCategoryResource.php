<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the service category HTTP response only.
 * services only included when explicitly loaded (whenLoaded prevents N+1).
 */
class ServiceCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'name'     => $this->name,
            'name_en'  => $this->name_en,
            'name_mm'  => $this->name_mm,
            'slug'     => $this->slug,
            'services' => ServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
