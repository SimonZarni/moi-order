<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'type'               => $this->type->value,
            'type_label'         => $this->type->label(),
            'subtype'            => $this->subtype,
            'expiry_date'        => $this->expiry_date?->format('Y-m-d'),
            'extension_date'     => $this->extension_date?->format('Y-m-d'),
            'is_valid_type'      => $this->is_valid_type,
            'validation_message' => $this->validation_message,
            'created_at'         => $this->created_at->toISOString(),
        ];
    }
}
