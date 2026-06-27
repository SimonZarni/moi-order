<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuCategoryResource extends JsonResource
{
    public function __construct($resource, private readonly ?FileStorageInterface $storage = null)
    {
        parent::__construct($resource);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'restaurant_id'   => $this->restaurant_id,
            'opening_hour_id' => $this->opening_hour_id,
            'name'            => $this->name,
            'sort_order'      => $this->sort_order,
            'category_type'   => $this->category_type?->value,
            'is_system'       => $this->isSystem(),
            'items'         => $this->whenLoaded('menuItems', function () use ($request) {
                $items = $this->menuItems;

                if ($this->isSystem() && $this->relationLoaded('linkedItems')) {
                    $items = $items->merge($this->linkedItems)->unique('id')->sortBy('sort_order')->values();
                }

                return $items->map(fn ($item) => (new MenuItemResource($item, $this->storage))->toArray($request))->values();
            }),
        ];
    }
}
