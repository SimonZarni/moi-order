<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\FoodOrderStatus;
use App\Events\FoodOrderStatusUpdated;
use App\Notifications\FoodOrderStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to FoodOrderStatusUpdated by notifying the customer only.
 * Principle: DIP — depends on Laravel's Notifiable trait via $user->notify().
 * ShouldQueue: push/database failure never rolls back the status transition transaction.
 *
 * Guard: skips order_placed (customer just placed it — they already know).
 */
class NotifyCustomerOfFoodOrderStatus implements ShouldQueue
{
    /** @var list<class-string<\Throwable>> */
    public array $dontReport = [];

    public function handle(FoodOrderStatusUpdated $event): void
    {
        $order = $event->order;

        // Customer placed the order — no need to notify them about it.
        if ($order->status === FoodOrderStatus::OrderPlaced) {
            return;
        }

        $user = $order->relationLoaded('user') ? $order->user : $order->user()->first();

        if ($user === null) {
            Log::warning('NotifyCustomerOfFoodOrderStatus: no user found', ['order_id' => $order->id]);
            return;
        }

        $user->notify(new FoodOrderStatusNotification($order));
    }
}
