<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Http\Resources\TicketImageResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes ticket HTTP response only.
 * Security: cover_image_path (internal storage path) never exposed; url() generates a signed URL.
 *   starting_from_price derived from variants — never trusted from the client.
 */
class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'highlight_description' => $this->highlight_description,
            'description'           => $this->description,
            'google_maps_link'      => $this->google_maps_link,
            'address'               => $this->address,
            'city'                  => $this->city,
            'province'              => $this->province,
            'cover_image_url'       => $this->cover_image_path !== null
                ? (str_starts_with($this->cover_image_path, 'http')
                    ? $this->cover_image_path
                    : app(\App\Contracts\FileStorageInterface::class)->url($this->cover_image_path))
                : null,
            'starting_from_price'   => $this->when(
                ! $this->relationLoaded('activeVariants'),
                fn () => $this->startingFromPrice(),
            ),
            'variants'              => $this->when(
                $this->relationLoaded('activeVariants'),
                fn () => TicketVariantResource::collection($this->activeVariants),
            ),
            'images'                => $this->when(
                $this->relationLoaded('images'),
                fn () => TicketImageResource::collection($this->images),
            ),
        ];
    }
}
