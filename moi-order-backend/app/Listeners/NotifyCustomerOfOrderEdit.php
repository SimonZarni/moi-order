<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\FoodOrderEdited;
use App\Notifications\FoodOrderEditedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — reacts to FoodOrderEdited by notifying the customer only.
 * ShouldQueue: notification failure never blocks the edit transaction.
 * Auto-discovered via typed handle() — do NOT also register in AppServiceProvider.
 */
class NotifyCustomerOfOrderEdit implements ShouldQueue
{
    public function handle(FoodOrderEdited $event): void
    {
        $order = $event->order;
        $user  = $order->relationLoaded('user') ? $order->user : $order->user()->first();

        if ($user === null) {
            Log::warning('NotifyCustomerOfOrderEdit: no user found', ['order_id' => $order->id]);
            return;
        }

        $user->notify(new FoodOrderEditedNotification($order));
    }
}
