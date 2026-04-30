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
 * Broadcast on the customer's private channel so the app receives real-time status updates.
 */
class FoodOrderStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly FoodOrder $order) {}

    /** @return Channel|list<Channel> */
    public function broadcastOn(): Channel|array
    {
        return new PrivateChannel("user.{$this->order->user_id}");
    }

    public function broadcastAs(): string
    {
        return 'food-order.status-updated';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'order_id'              => $this->order->id,
            'status'                => $this->order->status->value,
            'line_payment_url'      => $this->order->line_payment_url,
            'can_show_line_pay_btn' => $this->order->canShowLinePayButton(),
        ];
    }
}
