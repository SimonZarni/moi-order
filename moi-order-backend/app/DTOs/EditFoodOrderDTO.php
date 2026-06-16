<?php

declare(strict_types=1);

namespace App\DTOs;

readonly class EditFoodOrderDTO
{
    /**
     * @param list<array{id: int, quantity: int}>            $existingItems
     * @param list<array{menu_item_id: int, quantity: int}>  $newItems
     */
    public function __construct(
        public int   $orderId,
        public array $existingItems,
        public array $newItems,
    ) {}
}
