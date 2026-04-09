<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes document response and generates signed URL.
 * Principle: DIP — resolves FileStorageInterface from container; never calls Storage directly.
 * Principle: Security — raw file_path is never included in output (hidden on model).
 *   Client receives a 30-minute signed URL only.
 */
class SubmissionDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);

        return [
            'id'            => $this->id,
            'document_type' => $this->document_type->value,
            'label'         => $this->document_type->label(),
            'signed_url'    => $storage->url($this->file_path),
        ];
    }
}
