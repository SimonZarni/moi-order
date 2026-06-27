<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function __construct($resource, private readonly ?FileStorageInterface $storage = null)
    {
        parent::__construct($resource);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $photoUrl = null;
        if ($this->photo_path !== null && $this->storage !== null) {
            $photoUrl = $this->storage->publicUrl($this->photo_path);
        }

        return [
            'id'                   => $this->id,
            'menu_category_id'     => $this->menu_category_id,
            'restaurant_id'        => $this->restaurant_id,
            'name'                 => $this->name,
            'description'          => $this->description,
            'price_cents'          => $this->price_cents,
            'original_price_cents' => $this->original_price_cents,
            'photo_url'            => $photoUrl,
            'status'               => $this->status->value,
            'sort_order'           => $this->sort_order,
            'stock_quantity'       => $this->stock_quantity,
            'system_category_types' => $this->whenLoaded('systemCategories', fn () =>
                $this->systemCategories
                    ->map(fn ($c) => $c->category_type?->value)
                    ->filter()
                    ->values()
            ),
            'option_groups'        => $this->whenLoaded('optionGroups', fn () =>
                $this->optionGroups->map(fn ($g) => [
                    'id'             => $g->id,
                    'name'           => $g->name,
                    'is_required'    => $g->is_required,
                    'min_selections' => $g->min_selections,
                    'max_selections' => $g->max_selections,
                    'options'        => $g->options->map(fn ($o) => [
                        'id'                    => $o->id,
                        'name'                  => $o->name,
                        'additional_price_cents' => $o->additional_price_cents,
                        'is_available'           => $o->is_available,
                    ]),
                ])
            ),
        ];
    }
}
