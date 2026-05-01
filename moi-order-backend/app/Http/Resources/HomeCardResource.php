<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'slug'              => $this->slug,
            'position'          => $this->position,
            'title_en'          => $this->title_en,
            'title_mm'          => $this->title_mm,
            'subtitle_en'       => $this->subtitle_en,
            'subtitle_mm'       => $this->subtitle_mm,
            'tag_en'            => $this->tag_en,
            'tag_mm'            => $this->tag_mm,
            'accent_color'      => $this->accent_color,
            'icon_key'          => $this->icon_key->value,
            'navigation_screen' => $this->navigation_screen->value,
            'navigation_params' => $this->navigation_params,
            'is_active'         => $this->is_active,
            'is_coming_soon'    => $this->is_coming_soon,
        ];
    }
}
