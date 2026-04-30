<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\FoodPaymentMethod;
use App\Http\Requests\Api\StoreFoodOrderRequest;

readonly class StoreFoodOrderDTO
{
    /**
     * @param list<array{menu_item_id: int, quantity: int, notes: string|null}> $items
     */
    public function __construct(
        public int               $userId,
        public int               $restaurantId,
        public FoodPaymentMethod $paymentMethod,
        public string            $idempotencyKey,
        public ?string           $deliveryAddress,
        public ?float            $deliveryLat,
        public ?float            $deliveryLng,
        public ?string           $customerNotes,
        public array             $items,
    ) {}

    public static function fromRequest(StoreFoodOrderRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            userId:          $request->user()->id,
            restaurantId:    (int) $validated['restaurant_id'],
            paymentMethod:   FoodPaymentMethod::from($validated['payment_method']),
            idempotencyKey:  $validated['idempotency_key'],
            deliveryAddress: $validated['delivery_address'] ?? null,
            deliveryLat:     isset($validated['delivery_lat']) ? (float) $validated['delivery_lat'] : null,
            deliveryLng:     isset($validated['delivery_lng']) ? (float) $validated['delivery_lng'] : null,
            customerNotes:   $validated['customer_notes'] ?? null,
            items:           $validated['items'],
        );
    }
}
