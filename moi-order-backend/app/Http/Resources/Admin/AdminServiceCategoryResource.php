<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminServiceCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'name_en'           => $this->name_en,
            'name_mm'           => $this->name_mm,
            'slug'              => $this->slug,
            'navigation_screen' => $this->navigation_screen,
            'is_active'         => $this->is_active,
            'services'          => AdminServiceResource::collection($this->whenLoaded('services')),
        ];
    }
}
