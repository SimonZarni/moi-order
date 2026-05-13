<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminUserDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $fileUrl = null;
        if ($this->file_path) {
            $fileUrl = resolve(FileStorageInterface::class)->url($this->file_path, 60);
        }

        return [
            'id'                 => $this->id,
            'uuid'               => $this->uuid,
            'type'               => $this->type->value,
            'type_label'         => $this->type->label(),
            'subtype'            => $this->subtype,
            'file_url'           => $fileUrl,
            'extracted_data'     => $this->extracted_data ?? [],
            'expiry_date'        => $this->expiry_date?->format('Y-m-d'),
            'extension_date'     => $this->extension_date?->format('Y-m-d'),
            'is_valid_type'      => $this->is_valid_type,
            'validation_message' => $this->validation_message,
            'is_admin_created'   => $this->is_admin_created,
            'created_at'         => $this->created_at->toISOString(),
        ];
    }
}
