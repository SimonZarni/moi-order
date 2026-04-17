<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the service type HTTP response only.
 * Principle: Security — price exposed as raw satangs; client formats for display.
 *   Never expose is_active, deleted_at, or internal service_id in list context.
 */
class ServiceTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'name_en'      => $this->name_en,
            'name_mm'      => $this->name_mm,
            'price'        => $this->price, // satangs
            'field_schema' => $this->field_schema ?? [],
            'service'      => $this->when(
                $this->relationLoaded('service'),
                fn () => [
                    'id'      => $this->service->id,
                    'name'    => $this->service->name,
                    'name_en' => $this->service->name_en,
                    'name_mm' => $this->service->name_mm,
                ],
            ),
        ];
    }
}
