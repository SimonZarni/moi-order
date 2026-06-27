<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Resources\Json\JsonResource;

class SafetyLocationResource extends JsonResource
{
    public function toArray($request): array
    {
        $storage = app(FileStorageInterface::class);

        $photoPaths = $this->photo_paths ?? [];
        $photoUrls  = array_map(fn ($p) => $storage->url($p), $photoPaths);

        $coverUrl = $this->cover_photo_path !== null
            ? $storage->url($this->cover_photo_path)
            : null;

        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'category'        => $this->category->value,
            'category_label'  => $this->category->label(),
            'phone'           => $this->phone,
            'location'        => $this->location,
            'fb_page_link'    => $this->fb_page_link,
            'gmap_link'       => $this->gmap_link,
            'description'     => $this->description,
            'latitude'        => $this->latitude,
            'longitude'       => $this->longitude,
            'cover_photo_url' => $coverUrl,
            'photo_urls'      => $photoUrls,
            'created_at'      => $this->created_at?->toIso8601String(),
            'updated_at'      => $this->updated_at?->toIso8601String(),
        ];
    }
}
