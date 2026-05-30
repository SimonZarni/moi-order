<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes the place_photos row for admin consumption only.
 */
class AdminPlacePhotoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'photo_url'         => $this->photo_url,
            'google_photo_name' => $this->google_photo_name,
            'display_order'     => $this->display_order,
            'source'            => $this->source,
            'is_selected'       => (bool) $this->is_selected,
            'width_px'          => $this->width_px,
            'height_px'         => $this->height_px,
            'author_name'       => $this->author_name,
        ];
    }
}
