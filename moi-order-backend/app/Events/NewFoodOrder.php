<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\FoodOrder;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Broadcast on the merchant's private channel so the dashboard receives real-time order alerts.
 */
class NewFoodOrder implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly FoodOrder $order) {}

    /** @return Channel|list<Channel> */
    public function broadcastOn(): Channel|array
    {
        // Merchant receives orders on their private channel keyed by their user_id.
        return new PrivateChannel("merchant.{$this->order->restaurant->user_id}");
    }

    public function broadcastAs(): string
    {
        return 'food-order.new';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'order_id'      => $this->order->id,
            'restaurant_id' => $this->order->restaurant_id,
            'status'        => $this->order->status->value,
            'total_cents'   => $this->order->total_cents,
            'created_at'    => $this->order->created_at?->toIso8601String(),
        ];
    }
}
