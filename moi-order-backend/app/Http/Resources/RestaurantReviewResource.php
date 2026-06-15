<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Principle: SRP — shapes a single food-order review for the public reviews list.
 * Security: only user display name is exposed; never email, phone, or user id.
 */
class RestaurantReviewResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'user_name'  => $this->whenLoaded('user', fn () => $this->user->name, 'Anonymous'),
            'rating'     => $this->rating,
            'review'     => $this->customer_review,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
