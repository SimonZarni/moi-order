<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Contracts\FileStorageInterface;
use App\Models\InAppAlert;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin InAppAlert
 */
class InAppAlertResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $storage = resolve(FileStorageInterface::class);

        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'message'    => $this->message,
            'image_url'  => $this->image_path ? $storage->url($this->image_path) : null,
            'frequency'  => $this->frequency->value,
            'is_active'  => $this->is_active,
            'created_by' => $this->whenLoaded('creator', fn () => $this->creator ? [
                'id'   => $this->creator->uuid,
                'name' => $this->creator->name,
            ] : null),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
