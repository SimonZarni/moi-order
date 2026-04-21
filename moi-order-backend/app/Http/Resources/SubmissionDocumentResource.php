<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);

        return [
            'id'            => $this->id,
            'document_type' => $this->documentType->slug,
            'label'         => $this->documentType->name_en,
            'label_mm'      => $this->documentType->name_mm,
            'signed_url'    => $storage->url($this->file_path),
        ];
    }
}
