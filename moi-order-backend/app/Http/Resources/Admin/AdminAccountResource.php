<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminAccountResource extends JsonResource
{
    /** @return array<string,mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'is_active'  => $this->is_admin,
            'created_at' => $this->created_at?->toISOString(),
            'role'       => $this->whenLoaded('adminRole', fn (): array|null => $this->adminRole ? [
                'id'    => $this->adminRole->id,
                'slug'  => $this->adminRole->slug,
                'label' => $this->adminRole->label,
            ] : null),
        ];
    }
}
