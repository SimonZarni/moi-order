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
use App\Models\MenuItemOptionGroup;
use App\Models\Restaurant;
use App\Models\UserAddress;
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

            // Load option groups for items that have selected options — server validates
            // ownership and computes additional price from DB (never from client).
            $itemIdsWithOptions = collect($dto->items)
                ->filter(fn ($l) => ! empty($l['selected_options'] ?? []))
                ->pluck('menu_item_id')
                ->unique()
                ->all();

            $optionGroupsByItem = collect();
            if (! empty($itemIdsWithOptions)) {
                $optionGroupsByItem = MenuItemOptionGroup::with('options')
                    ->whereIn('menu_item_id', $itemIdsWithOptions)
                    ->get()
                    ->groupBy('menu_item_id');
            }

            // Server-side total calculation — never use client-supplied prices.
            $subtotal = 0;
            $lines    = [];
            foreach ($dto->items as $line) {
                $item           = $menuItems[$line['menu_item_id']];
                $rawSelections  = $line['selected_options'] ?? [];
                $groups         = $optionGroupsByItem->get($item->id, collect());

                // Validate each submitted option belongs to this item's groups.
                $additionalPriceCents = 0;
                $selectedOptionsData  = [];
                foreach ($rawSelections as $sel) {
                    $group = $groups->firstWhere('id', $sel['option_group_id']);
                    if ($group === null) {
                        throw new DomainException('order.invalid_option', 422);
                    }
                    $option = $group->options->firstWhere('id', $sel['option_id']);
                    if ($option === null || ! $option->is_available) {
                        throw new DomainException('order.invalid_option', 422);
                    }
                    // Price read from DB — client value ignored.
                    $additionalPriceCents += $option->additional_price_cents;
                    $selectedOptionsData[] = [
                        'option_group_id'   => $group->id,
                        'option_group_name' => $group->name,
                        'option_id'         => $option->id,
                        'option_name'       => $option->name,
                        'price_cents'       => $option->additional_price_cents,
                    ];
                }

                // Validate min/max selections per group (prevents under-selecting or client tampering).
                foreach ($groups as $group) {
                    $count = collect($selectedOptionsData)->where('option_group_id', $group->id)->count();
                    if ($group->is_required && $count < max(1, $group->min_selections)) {
                        throw new DomainException('order.required_option_missing', 422);
                    }
                    if ($count > $group->max_selections) {
                        throw new DomainException('order.too_many_options', 422);
                    }
                }

                $unitPrice = $item->price_cents + $additionalPriceCents;
                $lineTotal = $unitPrice * $line['quantity'];
                $subtotal += $lineTotal;
                $lines[]   = [
                    'menu_item_id'           => $item->id,
                    'name'                   => $item->name,
                    'price_cents'            => $item->price_cents,
                    'additional_price_cents' => $additionalPriceCents,
                    'quantity'               => $line['quantity'],
                    'notes'                  => $line['notes'] ?? null,
                    'selected_options'       => empty($selectedOptionsData) ? null : $selectedOptionsData,
                    'subtotal_cents'         => $lineTotal,
                ];
            }

            if ($subtotal < $restaurant->min_order_cents) {
                throw new DomainException('order.below_minimum', 422, [
                    'min_order_cents' => $restaurant->min_order_cents,
                    'subtotal_cents'  => $subtotal,
                ]);
            }

            // Resolve delivery address snapshot from saved address (user-scoped security check).
            $deliveryAddress = $dto->deliveryAddress;
            $deliveryLat     = $dto->deliveryLat;
            $deliveryLng     = $dto->deliveryLng;

            if ($dto->deliveryAddressId !== null) {
                $saved = UserAddress::where('user_id', $dto->userId)
                    ->where('id', $dto->deliveryAddressId)
                    ->firstOrFail();

                $deliveryAddress = $saved->formatted();
                $deliveryLat     = $saved->latitude;
                $deliveryLng     = $saved->longitude;
            }

            if ($deliveryAddress === null) {
                throw new DomainException('order.address_required', 422);
            }

            $order = FoodOrder::create([
                'user_id'          => $dto->userId,
                'restaurant_id'    => $restaurant->id,
                'status'           => FoodOrderStatus::OrderPlaced,
                'payment_method'   => $dto->paymentMethod,
                'subtotal_cents'   => $subtotal,
                'total_cents'      => $subtotal, // delivery fee phase 2
                'delivery_address' => $deliveryAddress,
                'delivery_lat'     => $deliveryLat,
                'delivery_lng'     => $deliveryLng,
                'customer_notes'   => $dto->customerNotes,
                'contact_no'       => $dto->contactNo,
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

        return $order->fresh(['items', 'user']);
    }

    public function acceptOrder(FoodOrder $order, int $preparationTimeMinutes): FoodOrder
    {
        DB::transaction(function () use ($order, $preparationTimeMinutes): void {
            $order->transitionTo(FoodOrderStatus::WaitingForPayment);
            $order->update(['preparation_time_minutes' => $preparationTimeMinutes]);
            event(new FoodOrderStatusUpdated($order->fresh()));
        });

        return $order->fresh(['items', 'user']);
    }

    public function startPreparing(FoodOrder $order, int $preparationTimeMinutes): FoodOrder
    {
        DB::transaction(function () use ($order, $preparationTimeMinutes): void {
            $order->transitionTo(FoodOrderStatus::PreparingFood);
            $order->update(['preparation_time_minutes' => $preparationTimeMinutes]);
            event(new FoodOrderStatusUpdated($order->fresh()));
        });

        return $order->fresh(['items', 'user']);
    }

    public function cancelByMerchant(FoodOrder $order, ?string $reason, ?string $description): FoodOrder
    {
        DB::transaction(function () use ($order, $reason, $description): void {
            $order->transitionTo(FoodOrderStatus::Cancelled);
            $order->update(array_filter([
                'cancel_reason'      => $reason,
                'cancel_description' => $description,
            ], fn ($v) => $v !== null));
            event(new FoodOrderStatusUpdated($order->fresh()));
        });

        return $order->fresh(['items', 'user']);
    }

    public function cancelByCustomer(FoodOrder $order): FoodOrder
    {
        DB::transaction(function () use ($order): void {
            $order->transitionTo(FoodOrderStatus::Cancelled);
            event(new FoodOrderStatusUpdated($order->fresh()));
        });

        return $order->fresh(['items', 'user']);
    }

    public function expireOrder(FoodOrder $order): FoodOrder
    {
        DB::transaction(function () use ($order): void {
            $order->transitionTo(FoodOrderStatus::Expired);
            event(new FoodOrderStatusUpdated($order->fresh()));
        });

        return $order->fresh(['items', 'user']);
    }

    public function deleteCancelled(FoodOrder $order): void
    {
        $order->delete();
    }

    /**
     * Submit or update a star rating + optional review on a completed order.
     * Guards: order must be Completed; only the owning user may call this.
     *
     * @throws DomainException when order is not yet completed.
     */
    public function saveReview(FoodOrder $order, int $rating, ?string $review): FoodOrder
    {
        if ($order->status !== FoodOrderStatus::Completed) {
            throw new DomainException('order.not_completed', 409);
        }

        $order->update([
            'rating'          => $rating,
            'customer_review' => $review,
        ]);

        return $order->fresh(['items', 'restaurant', 'user']);
    }

    /**
     * Customer completes a delivered order, optionally leaving a rating + review.
     * Also used by the auto-complete command (rating/review are null in that case).
     */
    public function completeByCustomer(FoodOrder $order, ?int $rating, ?string $review): FoodOrder
    {
        DB::transaction(function () use ($order, $rating, $review): void {
            $order->transitionTo(FoodOrderStatus::Completed);

            if ($rating !== null || $review !== null) {
                $order->update(array_filter([
                    'rating'          => $rating,
                    'customer_review' => $review,
                ], fn ($v) => $v !== null));
            }

            event(new FoodOrderStatusUpdated($order->fresh()));
        });

        return $order->fresh(['items', 'restaurant', 'user']);
    }

    public function listForUser(int $userId, int $perPage = 20): LengthAwarePaginator
    {
        return FoodOrder::forUser($userId)
            ->with(['items', 'restaurant'])
            ->latest()
            ->paginate($perPage);
    }

    /**
     * @param array{date?: string, date_from?: string, date_to?: string, statuses?: string[]} $filters
     */
    public function listForRestaurant(
        int   $restaurantId,
        array $filters  = [],
        int   $perPage  = 30,
    ): LengthAwarePaginator {
        $query = FoodOrder::forRestaurant($restaurantId)
            ->with(['items', 'user'])
            ->latest();

        if (! empty($filters['date'])) {
            $query->whereDate('created_at', $filters['date']);
        } elseif (! empty($filters['date_from']) && ! empty($filters['date_to'])) {
            $query->whereBetween('created_at', [
                $filters['date_from'] . ' 00:00:00',
                $filters['date_to']   . ' 23:59:59',
            ]);
        }

        if (! empty($filters['statuses'])) {
            $query->whereIn('status', $filters['statuses']);
        }

        return $query->paginate($perPage);
    }
}
