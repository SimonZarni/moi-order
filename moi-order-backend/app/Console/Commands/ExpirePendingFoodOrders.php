<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\FoodOrderStatus;
use App\Exceptions\DomainException;
use App\Models\FoodOrder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Expires food orders that remain in order_placed or waiting_for_payment
 * for more than 30 minutes — indicating the restaurant has not responded.
 *
 * Principle: SRP — command owns scheduling concern only; domain logic stays in the model.
 * Runs every 5 minutes via the scheduler. DomainException guard prevents failures from
 * racing manual transitions between the query and the transition call.
 */
class ExpirePendingFoodOrders extends Command
{
    protected $signature   = 'food-orders:expire-pending';
    protected $description = 'Expire food orders pending without restaurant response for more than 30 minutes.';

    public function handle(): int
    {
        $cutoff = now()->subMinutes(30);

        $orders = FoodOrder::whereIn('status', [
            FoodOrderStatus::OrderPlaced->value,
            FoodOrderStatus::WaitingForPayment->value,
        ])
        ->where('created_at', '<=', $cutoff)
        ->get();

        foreach ($orders as $order) {
            try {
                $order->transitionTo(FoodOrderStatus::Expired);

                Log::info('ExpirePendingFoodOrders: expired', ['order_id' => $order->id]);
            } catch (DomainException $e) {
                // Order was already transitioned between query and transition — skip gracefully.
                Log::info('ExpirePendingFoodOrders: skipped', [
                    'order_id' => $order->id,
                    'reason'   => $e->getMessage(),
                ]);
            }
        }

        return self::SUCCESS;
    }
}
