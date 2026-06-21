<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\RestaurantDailyInvoice;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — signals that admin has confirmed cashout for one invoice.
 * ShouldBroadcastNow: DB is already committed before this fires so the merchant
 * app can immediately refetch and see the updated status.
 */
class CashOutConfirmed implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly RestaurantDailyInvoice $invoice,
    ) {}

    /** @return array<int, PrivateChannel> */
    public function broadcastOn(): array
    {
        $merchantId = $this->invoice->restaurant->user_id;
        return [new PrivateChannel("merchant.{$merchantId}")];
    }

    public function broadcastAs(): string
    {
        return 'cashout.confirmed';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'invoice_id'  => $this->invoice->id,
            'date'        => $this->invoice->date->toDateString(),
            'payout_cents' => $this->invoice->payout_cents,
            'paid_at'     => $this->invoice->paid_at?->toIso8601String(),
        ];
    }
}
