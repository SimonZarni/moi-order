<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Contracts\FileStorageInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FoodOrderResource extends JsonResource
{
    public function __construct($resource, private readonly ?FileStorageInterface $storage = null)
    {
        parent::__construct($resource);
    }

    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $restaurantLogoUrl = null;
        if ($this->relationLoaded('restaurant') && $this->restaurant->logo_path !== null && $this->storage !== null) {
            $restaurantLogoUrl = $this->storage->publicUrl($this->restaurant->logo_path);
        }

        return [
            'id'                     => $this->id,
            'order_number'           => $this->order_number,
            'restaurant_id'          => $this->restaurant_id,
            'restaurant_name'        => $this->whenLoaded('restaurant', fn () => $this->restaurant->name),
            'restaurant_logo_url'    => $restaurantLogoUrl,
            'status'                 => $this->status->value,
            'status_label'           => $this->status->label(),
            'payment_method'         => $this->payment_method->value,
            'subtotal_cents'         => $this->subtotal_cents,
            'total_cents'            => $this->total_cents,
            'delivery_address'       => $this->delivery_address,
            'customer_notes'         => $this->customer_notes,
            'prompt_pay_url'         => $this->prompt_pay_url,
            'can_show_prompt_pay'    => $this->canShowPromptPay(),
            'user'                   => $this->whenLoaded('user', fn () => [
                'id'    => $this->user->id,
                'name'  => $this->user->name,
                'phone' => $this->user->phone_number,
            ]),
            'items'                  => $this->whenLoaded('items', fn () =>
                FoodOrderItemResource::collection($this->items)
            ),
            'rating'                 => $this->rating,
            'customer_review'        => $this->customer_review,
            'confirmed_at'           => $this->confirmed_at?->toIso8601String(),
            'payment_confirmed_at'   => $this->payment_confirmed_at?->toIso8601String(),
            'preparing_at'           => $this->preparing_at?->toIso8601String(),
            'picked_up_at'           => $this->picked_up_at?->toIso8601String(),
            'delivered_at'           => $this->delivered_at?->toIso8601String(),
            'completed_at'           => $this->completed_at?->toIso8601String(),
            'cancelled_at'           => $this->cancelled_at?->toIso8601String(),
            'created_at'             => $this->created_at?->toIso8601String(),
        ];
    }
}
