<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminRoleResource extends JsonResource
{
    /** @return array<string,mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'slug'            => $this->slug,
            'label'           => $this->label,
            'permission_keys' => $this->whenLoaded(
                'permissions',
                fn (): array => $this->permissions->pluck('key')->all(),
                [],
            ),
        ];
    }
}
