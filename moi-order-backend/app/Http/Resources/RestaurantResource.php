<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    public function __construct($resource, private readonly ?FileStorageInterface $storage = null)
    {
        parent::__construct($resource);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $coverUrl = null;
        $logoUrl  = null;

        if ($this->storage !== null) {
            if ($this->cover_photo_path !== null) {
                $coverUrl = $this->storage->publicUrl($this->cover_photo_path);
            }
            if ($this->logo_path !== null) {
                $logoUrl = $this->storage->publicUrl($this->logo_path);
            }
        }

        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'merchant'              => $this->whenLoaded('merchant', fn () => [
                'id'    => $this->merchant->id,
                'name'  => $this->merchant->name,
                'email' => $this->merchant->email,
            ]),
            'description'           => $this->description,
            'address'               => $this->address,
            'latitude'              => $this->latitude,
            'longitude'             => $this->longitude,
            'phone'                 => $this->phone,
            'cover_photo_url'       => $coverUrl,
            'logo_url'              => $logoUrl,
            'status'                => $this->status->value,
            'platform_status'       => $this->platform_status->value,
            'delivery_radius_km'    => $this->delivery_radius_km,
            'is_delivery_available' => $this->is_delivery_available,
            'is_pickup_available'   => $this->is_pickup_available,
            'min_order_cents'       => $this->min_order_cents,
            'is_open_now'           => $this->whenLoaded('openingHours', fn () => $this->isOpenNow()),
            'opening_hours'         => $this->whenLoaded('openingHours', fn () =>
                $this->openingHours->map(fn ($h) => [
                    'day_of_week' => $h->day_of_week,
                    'opens_at'    => $h->opens_at,
                    'closes_at'   => $h->closes_at,
                    'is_closed'   => $h->is_closed,
                ])
            ),
            'photos'                => $this->whenLoaded('photos', fn () =>
                $this->photos->map(fn ($p) => [
                    'id'         => $p->id,
                    'url'        => $this->storage?->publicUrl($p->file_path),
                    'sort_order' => $p->sort_order,
                ])
            ),
            'menu'                  => $this->whenLoaded('menuCategories', fn () =>
                $this->menuCategories->map(fn ($cat) =>
                    (new MenuCategoryResource($cat, $this->storage))->toArray($request)
                )
            ),
            'created_at'            => $this->created_at?->toIso8601String(),
        ];
    }
}
