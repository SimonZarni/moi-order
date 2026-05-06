<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * List endpoint: includes coverPhoto only (lightweight).
 * Detail endpoint: includes all photos.
 */
class EmergencyContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var FileStorageInterface $storage */
        $storage = app(FileStorageInterface::class);

        return [
            'id'             => $this->id,
            'type'           => $this->type->value,
            'title_en'       => $this->title_en,
            'title_mm'       => $this->title_mm,
            'title_th'       => $this->title_th,
            'description_en' => $this->description_en,
            'description_mm' => $this->description_mm,
            'description_th' => $this->description_th,
            'phone'          => $this->phone,
            'map_url'        => $this->map_url,
            'latitude'       => $this->latitude,
            'longitude'      => $this->longitude,
            'location'       => $this->location,
            'facebook_url'   => $this->facebook_url,
            'website_url'    => $this->website_url,
            // List endpoint loads coverPhoto (1 row). Detail loads photos (all rows).
            'cover_photo'    => $this->whenLoaded('coverPhoto', function () use ($storage) {
                if (! $this->coverPhoto) return null;
                return str_starts_with($this->coverPhoto->path, 'http')
                    ? $this->coverPhoto->path
                    : $storage->publicUrl($this->coverPhoto->path);
            }),
            'photos'         => $this->whenLoaded('photos', fn () =>
                EmergencyContactPhotoResource::collection($this->photos)
            ),
        ];
    }
}
