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
 * Broadcast on the customer's private channel so the mobile app refreshes
 * the order detail and shows an "order updated" notice.
 */
class FoodOrderEdited implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly FoodOrder $order) {}

    /** @return Channel|list<Channel> */
    public function broadcastOn(): Channel|array
    {
        return new PrivateChannel('user.' . $this->order->user->uuid);
    }

    public function broadcastAs(): string
    {
        return 'food-order.edited';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'order_id'       => $this->order->id,
            'order_uuid'     => $this->order->uuid,
            'total_cents'    => $this->order->total_cents,
            'subtotal_cents' => $this->order->subtotal_cents,
        ];
    }
}
