<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\StoreFoodOrderDTO;
use App\Enums\FoodOrderStatus;
use App\Events\FoodOrderStatusUpdated;
use App\Events\NewFoodOrder;
use App\Exceptions\DomainException;
use App\Models\FoodOrder;
use App\Models\MenuItem;
use App\Models\Restaurant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — food order lifecycle only. Totals computed here (server-side; never trust client).
 * Principle: Security — prices read from DB, not from client payload.
 * Principle: Idempotency — duplicate idempotency_key returns existing order (409 is NOT raised).
 */
class FoodOrderService
{
    public function place(StoreFoodOrderDTO $dto): FoodOrder
    {
        // Idempotency: return existing order if key already used by this user.
        $existing = FoodOrder::where('idempotency_key', $dto->idempotencyKey)
            ->where('user_id', $dto->userId)
            ->first();

        if ($existing !== null) {
            return $existing->load(['items', 'restaurant']);
        }

        return DB::transaction(function () use ($dto): FoodOrder {
            $restaurant = Restaurant::findOrFail($dto->restaurantId);

            if (! $restaurant->isAcceptingOrders()) {
                throw new DomainException('order.restaurant_not_accepting', 409);
            }

            // Load items with a lock to prevent stale-read on concurrent price changes.
            $itemIds  = array_column($dto->items, 'menu_item_id');
            $menuItems = MenuItem::whereIn('id', $itemIds)
                ->where('restaurant_id', $restaurant->id)
                ->available()
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            // Validate all items belong to this restaurant and are available.
            foreach ($dto->items as $line) {
                if (! $menuItems->has($line['menu_item_id'])) {
                    throw new DomainException('order.item_unavailable', 422);
                }
            }

            // Server-side total calculation — never use client-supplied prices.
            $subtotal = 0;
            $lines    = [];
            foreach ($dto->items as $line) {
                $item      = $menuItems[$line['menu_item_id']];
                $lineTotal = $item->price_cents * $line['quantity'];
                $subtotal += $lineTotal;
                $lines[]   = [
                    'menu_item_id'   => $item->id,
                    'name'           => $item->name,
                    'price_cents'    => $item->price_cents,
                    'quantity'       => $line['quantity'],
                    'notes'          => $line['notes'] ?? null,
                    'subtotal_cents' => $lineTotal,
                ];
            }

            if ($subtotal < $restaurant->min_order_cents) {
                throw new DomainException('order.below_minimum', 422, [
                    'min_order_cents' => $restaurant->min_order_cents,
                    'subtotal_cents'  => $subtotal,
                ]);
            }

            $order = FoodOrder::create([
                'user_id'          => $dto->userId,
                'restaurant_id'    => $restaurant->id,
                'status'           => FoodOrderStatus::OrderPlaced,
                'payment_method'   => $dto->paymentMethod,
                'subtotal_cents'   => $subtotal,
                'total_cents'      => $subtotal, // delivery fee phase 2
                'delivery_address' => $dto->deliveryAddress,
                'delivery_lat'     => $dto->deliveryLat,
                'delivery_lng'     => $dto->deliveryLng,
                'customer_notes'   => $dto->customerNotes,
                'idempotency_key'  => $dto->idempotencyKey,
            ]);

            $order->items()->createMany($lines);

            $order->update(['order_number' => FoodOrder::generateOrderNumber()]);

            event(new NewFoodOrder($order->load('restaurant')));

            return $order->load(['items', 'restaurant']);
        });
    }

    public function updateStatus(FoodOrder $order, FoodOrderStatus $newStatus): FoodOrder
    {
        DB::transaction(function () use ($order, $newStatus): void {
            $order->transitionTo($newStatus);
            event(new FoodOrderStatusUpdated($order->fresh()));
        });

        return $order->fresh(['items', 'restaurant']);
    }

    public function listForUser(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return FoodOrder::forUser($userId)
            ->with(['items', 'restaurant'])
            ->latest()
            ->paginate($perPage);
    }

    public function listForRestaurant(int $restaurantId, int $perPage = 30): LengthAwarePaginator
    {
        return FoodOrder::forRestaurant($restaurantId)
            ->with(['items', 'user'])
            ->latest()
            ->paginate($perPage);
    }
}
