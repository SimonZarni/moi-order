<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminHomeCardRouteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'key'       => $this->key,
            'label_en'  => $this->label_en,
            'label_mm'  => $this->label_mm,
            'type'      => $this->type->value,
            'url'       => $this->url,
            'is_active' => $this->is_active,
        ];
    }
}
