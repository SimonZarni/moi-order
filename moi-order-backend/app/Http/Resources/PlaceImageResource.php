<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: Security — raw storage path never exposed; only signed temporary URL returned.
 */
class PlaceImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);

        return [
            'id'         => $this->id,
            'url'        => str_starts_with($this->path, 'http')
                ? $this->path
                : $storage->publicUrl($this->path),
            'sort_order' => $this->sort_order,
        ];
    }
}
