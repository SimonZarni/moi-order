<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — resource shapes the HTTP response only.
 * Principle: Security — sensitive fields never present; whenLoaded() prevents N+1.
 *                       cover_image returns a signed URL, never a raw storage path.
 *
 * List response  : includes category + first image only (lightweight).
 * Detail response: includes category + all images + tags (full).
 */
class PlaceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);

        return [
            'id'                => $this->id,
            'name_my'           => $this->name_my,
            'name_en'           => $this->name_en,
            'name_th'           => $this->name_th,
            'short_description' => $this->short_description,
            'long_description'  => $this->long_description,
            'address'           => $this->address,
            'city'              => $this->city,
            'latitude'          => $this->latitude,
            'longitude'         => $this->longitude,
            'opening_hours'     => $this->opening_hours,
            'contact_phone'     => $this->contact_phone,
            'website'           => $this->website,
            'category'          => new CategoryResource($this->whenLoaded('category')),
            'tags'              => TagResource::collection($this->whenLoaded('tags')),
            'images'            => PlaceImageResource::collection($this->whenLoaded('images')),
            // List endpoint loads the coverImage HasOne (1 row per place).
            // Detail endpoint loads the full images collection.
            // Both paths resolve to a signed URL here; the other returns null.
            'cover_image'       => $this->whenLoaded('coverImage', function () use ($storage) {
                return $this->coverImage ? $storage->url($this->coverImage->path) : null;
            }, $this->whenLoaded('images', function () use ($storage) {
                $first = $this->images->first();
                return $first ? $storage->url($first->path) : null;
            })),
        ];
    }
}
