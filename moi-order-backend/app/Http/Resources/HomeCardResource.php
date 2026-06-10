<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Enums\HomeCardIconType;
use App\Enums\HomeCardRouteType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeCardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'parent_id'         => $this->parent_id,
            'slug'              => $this->slug,
            'position'          => $this->position,
            'title_en'          => $this->title_en,
            'title_mm'          => $this->title_mm,
            'subtitle_en'       => $this->subtitle_en,
            'subtitle_mm'       => $this->subtitle_mm,
            'tag_en'            => $this->tag_en,
            'tag_mm'            => $this->tag_mm,
            'accent_color'      => $this->accent_color,
            'border_color'      => $this->border_color,
            'icon_color'        => $this->icon_color,
            'icon_key'          => $this->icon_key,
            'icon_type'         => $this->whenLoaded('icon', fn () => $this->icon?->type?->value ?? HomeCardIconType::Builtin->value, HomeCardIconType::Builtin->value),
            'icon_url'          => $this->whenLoaded('icon', fn () => $this->icon?->image_url ?? null, null),
            'navigation_screen' => $this->navigation_screen,
            'route_type'        => $this->whenLoaded('route', fn () => $this->route?->type?->value ?? HomeCardRouteType::Internal->value, HomeCardRouteType::Internal->value),
            'route_url'         => $this->whenLoaded('route', fn () => $this->route?->url, null),
            'navigation_params' => $this->navigation_params,
            'is_active'         => $this->is_active,
            'is_coming_soon'    => $this->is_coming_soon,
            'children'          => HomeCardResource::collection($this->whenLoaded('children')),
        ];
    }
}
