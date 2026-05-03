<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var \App\Models\Document $this */
        $storage = resolve(FileStorageInterface::class);

        return [
            'id'                 => $this->id,
            'type'               => $this->type->value,
            'subtype'            => $this->subtype,
            // Signed 60-min URL — null for admin-created records that have no file.
            'file_url'           => $this->file_path ? $storage->url($this->file_path, 60) : null,
            'extracted_data'     => $this->extracted_data ?? [],
            'expiry_date'        => $this->expiry_date?->format('Y-m-d'),
            'extension_date'     => $this->extension_date?->format('Y-m-d'),
            'is_valid_type'      => $this->is_valid_type,
            'validation_message' => $this->validation_message,
            'created_at'         => $this->created_at->toISOString(),
            'updated_at'         => $this->updated_at->toISOString(),
        ];
    }
}
