<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Resources\Json\JsonResource;

class SafetyLocationResource extends JsonResource
{
    public function __construct($resource, private readonly ?FileStorageInterface $storage = null)
    {
        parent::__construct($resource);
    }

    public function toArray($request): array
    {
        $photoPaths = $this->photo_paths ?? [];
        $photoUrls  = $this->storage !== null
            ? array_map(fn ($p) => $this->storage->url($p), $photoPaths)
            : $photoPaths;

        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'category'     => $this->category->value,
            'category_label' => $this->category->label(),
            'phone'        => $this->phone,
            'location'     => $this->location,
            'fb_page_link' => $this->fb_page_link,
            'gmap_link'    => $this->gmap_link,
            'description'  => $this->description,
            'latitude'     => $this->latitude,
            'longitude'    => $this->longitude,
            'photo_urls'   => $photoUrls,
            'created_at'   => $this->created_at?->toIso8601String(),
            'updated_at'   => $this->updated_at?->toIso8601String(),
        ];
    }
}
