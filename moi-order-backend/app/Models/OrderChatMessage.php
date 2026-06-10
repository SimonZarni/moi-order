<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderChatMessage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'food_order_id', 'sender_type', 'sender_id', 'sender_name',
        'body', 'image_path', 'read_at',
    ];

    protected function casts(): array
    {
        return ['read_at' => 'datetime'];
    }

    public function foodOrder(): BelongsTo
    {
        return $this->belongsTo(FoodOrder::class);
    }

    public function scopeForOrder(Builder $query, int $orderId): Builder
    {
        return $query->where('food_order_id', $orderId);
    }

    public function markRead(): void
    {
        if ($this->read_at === null) {
            $this->update(['read_at' => now()]);
        }
    }

    /**
     * Post an automated system notice into an order's chat thread (e.g. the
     * pre-deletion warning sent when an order reaches a terminal status).
     */
    public static function postSystemMessage(int $foodOrderId, string $body): self
    {
        return self::create([
            'food_order_id' => $foodOrderId,
            'sender_type'   => 'system',
            'sender_id'     => 0,
            'sender_name'   => 'System',
            'body'          => $body,
        ]);
    }
}
