<?php

declare(strict_types=1);

namespace App\Http\Resources\Merchant;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes KycDocument API output.
 * Principle: Security — file_path never exposed; signed URL generated via FileStorageInterface.
 * Principle: DIP — resolves FileStorageInterface from container (resources cannot use
 *   constructor injection with ResourceCollection without losing ResourceCollection features).
 */
class KycDocumentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        /** @var \App\Models\KycDocument $this */

        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);

        return [
            'id'         => $this->id,
            'type'       => $this->type->value,
            'type_label' => $this->type->label(),
            'url'        => $storage->url($this->file_path),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
