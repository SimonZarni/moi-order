<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminTagResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name_my'      => $this->name_my,
            'name_en'      => $this->name_en,
            'name_th'      => $this->name_th,
            'slug'         => $this->slug,
            'places_count' => $this->whenCounted('places'),
            'created_at'   => $this->created_at->toISOString(),
            'deleted_at'   => $this->deleted_at?->toISOString(),
        ];
    }
}
