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
            'id'               => $this->id,
            'menu_category_id' => $this->menu_category_id,
            'restaurant_id'    => $this->restaurant_id,
            'name'             => $this->name,
            'description'      => $this->description,
            'price_cents'      => $this->price_cents,
            'photo_url'        => $photoUrl,
            'status'           => $this->status->value,
            'sort_order'       => $this->sort_order,
        ];
    }
}
