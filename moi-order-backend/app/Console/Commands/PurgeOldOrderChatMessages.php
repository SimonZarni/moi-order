<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\FoodOrderStatus;
use App\Models\OrderChatMessage;
use Illuminate\Console\Command;

class PurgeOldOrderChatMessages extends Command
{
    protected $signature   = 'order-chat:purge';
    protected $description = 'Soft-delete chat messages for orders completed more than 3 hours ago.';

    public function handle(): int
    {
        $cutoff = now()->subHours(3);

        OrderChatMessage::query()
            ->whereHas('foodOrder', fn ($q) => $q
                ->where('status', FoodOrderStatus::Completed->value)
                ->where('completed_at', '<=', $cutoff)
            )
            ->whereNull('deleted_at')
            ->update(['deleted_at' => now()]);

        return self::SUCCESS;
    }
}
