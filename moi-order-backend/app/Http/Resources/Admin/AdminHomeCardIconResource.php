<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Enums\HomeCardIconType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminHomeCardIconResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'key'       => $this->key,
            'label'     => $this->label,
            'type'      => $this->type->value,
            'image_url' => $this->type === HomeCardIconType::Custom
                ? ($this->image_url ?? null)
                : null,
            'is_active' => $this->is_active,
        ];
    }
}
