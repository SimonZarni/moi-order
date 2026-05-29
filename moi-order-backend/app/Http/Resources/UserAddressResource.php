<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserAddressResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'label'         => $this->label->value,
            'label_display' => $this->label->label(),
            'address'       => $this->address,
            'building'      => $this->building,
            'floor'         => $this->floor,
            'landmark'      => $this->landmark,
            'province'       => $this->province,
            'contact_name'   => $this->contact_name,
            'contact_phone'  => $this->contact_phone,
            'latitude'       => $this->latitude,
            'longitude'     => $this->longitude,
            'is_default'    => $this->is_default,
            'created_at'    => $this->created_at->toIso8601String(),
        ];
    }
}
