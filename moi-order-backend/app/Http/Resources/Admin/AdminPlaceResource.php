<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use App\Contracts\FileStorageInterface;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\PlaceImageResource;
use App\Http\Resources\TagResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminPlaceResource extends JsonResource
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
            'google_map_url'    => $this->google_map_url,
            'created_at'        => $this->created_at->toISOString(),
            'deleted_at'        => $this->deleted_at?->toISOString(),
            'category'          => new CategoryResource($this->whenLoaded('category')),
            'tags'              => TagResource::collection($this->whenLoaded('tags')),
            'images'            => PlaceImageResource::collection($this->whenLoaded('images')),
            'cover_image'       => $this->whenLoaded('coverImage', function () use ($storage) {
                return $this->coverImage ? $storage->url($this->coverImage->path) : null;
            }, $this->whenLoaded('images', function () use ($storage) {
                $first = $this->images->first();
                return $first ? $storage->url($first->path) : null;
            })),
        ];
    }
}
