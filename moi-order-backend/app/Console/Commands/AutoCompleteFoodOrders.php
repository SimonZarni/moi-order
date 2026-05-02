<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\FoodOrderStatus;
use App\Exceptions\DomainException;
use App\Models\FoodOrder;
use App\Services\FoodOrderService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * Auto-completes delivered food orders that have not been confirmed by the customer
 * within 10 minutes of delivery. Runs every minute via the scheduler.
 *
 * DomainException guard: if the order was manually completed between the query and the
 * transition, transitionTo() throws DomainException — caught per-order, never fatal.
 */
class AutoCompleteFoodOrders extends Command
{
    protected $signature   = 'food-orders:auto-complete';
    protected $description = 'Complete food orders that have been delivered for more than 10 minutes.';

    public function __construct(private readonly FoodOrderService $orderService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $orders = FoodOrder::where('status', FoodOrderStatus::Delivered->value)
            ->where('delivered_at', '<=', now()->subMinutes(10))
            ->get();

        foreach ($orders as $order) {
            try {
                $this->orderService->completeByCustomer($order, null, null);
            } catch (DomainException $e) {
                // Order was already transitioned (manual complete raced the command). Skip.
                Log::info('AutoCompleteFoodOrders: skipped', [
                    'order_id' => $order->id,
                    'reason'   => $e->getMessage(),
                ]);
            }
        }

        return self::SUCCESS;
    }
}
