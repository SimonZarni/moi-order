<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Events\OrderChatMessageSent;
use App\Events\OrderChatMessagesRead;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrderChatMessageRequest;
use App\Http\Resources\OrderChatMessageResource;
use App\Models\OrderChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MerchantOrderChatController extends Controller
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    /** GET /api/merchant/v1/orders/{id}/chat */
    public function index(Request $request, string $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->where('uuid', $id)->firstOrFail();

        $messages = OrderChatMessage::query()
            ->forOrder($order->id)
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $messages->map(fn ($m) => (new OrderChatMessageResource($m, $this->storage))->toArray($request))->values(),
        ]);
    }

    /** POST /api/merchant/v1/orders/{id}/chat */
    public function store(StoreOrderChatMessageRequest $request, string $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->where('uuid', $id)->firstOrFail();
        $user       = $request->user();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->storage->store(
                $request->file('image'),
                'chat-images',
                [],
            );
        }

        $replyMsg = $request->filled('reply_to_id')
            ? OrderChatMessage::find($request->integer('reply_to_id'))
            : null;

        $message = OrderChatMessage::create([
            'food_order_id'        => $order->id,
            'sender_type'          => 'merchant',
            'sender_id'            => $user->id,
            'sender_name'          => $restaurant->name ?? $user->name,
            'body'                 => $request->filled('body') ? $request->string('body')->toString() : null,
            'image_path'           => $imagePath,
            'reply_to_id'          => $replyMsg?->id,
            'reply_to_body'        => $replyMsg?->body,
            'reply_to_sender_name' => $replyMsg?->sender_name,
        ]);

        event(new OrderChatMessageSent($message));

        return response()->json(
            ['data' => new OrderChatMessageResource($message, $this->storage)],
            201,
        );
    }

    /** POST /api/merchant/v1/orders/{id}/chat/read */
    public function markRead(Request $request, string $id): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $order      = $restaurant->foodOrders()->where('uuid', $id)->firstOrFail();

        $now = now();
        $ids = OrderChatMessage::query()
            ->forOrder($order->id)
            ->whereNull('read_at')
            ->where('sender_type', '!=', 'merchant')
            ->pluck('id')
            ->all();

        if (!empty($ids)) {
            OrderChatMessage::whereIn('id', $ids)->update(['read_at' => $now]);
            event(new OrderChatMessagesRead($order->uuid, 'merchant', $ids, $now->toIso8601String()));
        }

        return response()->json(null, 204);
    }
}
