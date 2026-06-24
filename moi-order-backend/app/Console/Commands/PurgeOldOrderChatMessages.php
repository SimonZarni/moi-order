<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\FileStorageInterface;
use App\Enums\FoodOrderStatus;
use App\Models\MerchantNotification;
use App\Models\OrderChatMessage;
use Illuminate\Console\Command;

class PurgeOldOrderChatMessages extends Command
{
    protected $signature   = 'order-chat:purge';
    protected $description = 'Permanently delete chat messages for orders completed or cancelled more than 3 hours ago.';

    public function __construct(private readonly FileStorageInterface $storage)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $cutoff = now()->subHours(3);

        $messages = OrderChatMessage::query()
            ->whereHas('foodOrder', fn ($q) => $q
                ->where(fn ($q2) => $q2
                    ->where('status', FoodOrderStatus::Completed->value)
                    ->where('completed_at', '<=', $cutoff))
                ->orWhere(fn ($q2) => $q2
                    ->where('status', FoodOrderStatus::Cancelled->value)
                    ->where('cancelled_at', '<=', $cutoff))
            )
            ->get();

        foreach ($messages as $message) {
            if ($message->image_path !== null) {
                $this->storage->delete($message->image_path);
            }

            $message->forceDelete();
        }

        // Remove chat_message notifications whose chats are now permanently closed.
        MerchantNotification::query()
            ->where('type', 'chat_message')
            ->whereHas('order', fn ($q) => $q
                ->where(fn ($q2) => $q2
                    ->where('status', FoodOrderStatus::Completed->value)
                    ->where('completed_at', '<=', $cutoff))
                ->orWhere(fn ($q2) => $q2
                    ->where('status', FoodOrderStatus::Cancelled->value)
                    ->where('cancelled_at', '<=', $cutoff))
            )
            ->forceDelete();

        return self::SUCCESS;
    }
}
