<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\Events\OrderChatMessageDeleted;
use App\Events\OrderChatMessageSent;
use App\Events\OrderChatMessagesRead;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrderChatMessageRequest;
use App\Http\Resources\OrderChatMessageResource;
use App\Models\FoodOrder;
use App\Models\OrderChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderChatController extends Controller
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    /** GET /api/v1/food-orders/{id}/chat */
    public function index(Request $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();

        $messages = OrderChatMessage::query()
            ->forOrder($order->id)
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $messages->map(fn ($m) => (new OrderChatMessageResource($m, $this->storage))->toArray($request))->values(),
        ]);
    }

    /** POST /api/v1/food-orders/{id}/chat */
    public function store(StoreOrderChatMessageRequest $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();
        $user  = $request->user();

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
            'sender_type'          => 'customer',
            'sender_id'            => $user->id,
            'sender_name'          => $user->name,
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

    /** POST /api/v1/food-orders/{id}/chat/read */
    public function markRead(Request $request, string $id): JsonResponse
    {
        $order = FoodOrder::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();

        $now = now();
        $ids = OrderChatMessage::query()
            ->forOrder($order->id)
            ->whereNull('read_at')
            ->where('sender_type', '!=', 'customer')
            ->pluck('id')
            ->all();

        if (!empty($ids)) {
            OrderChatMessage::whereIn('id', $ids)->update(['read_at' => $now]);
            event(new OrderChatMessagesRead($order->uuid, 'customer', $ids, $now->toIso8601String()));
        }

        return response()->json(null, 204);
    }

    /** DELETE /api/v1/food-orders/{id}/chat/{messageId} */
    public function destroy(Request $request, string $id, int $messageId): JsonResponse
    {
        $order   = FoodOrder::forUser($request->user()->id)->where('uuid', $id)->firstOrFail();
        $message = OrderChatMessage::forOrder($order->id)
            ->where('id', $messageId)
            ->where('sender_type', 'customer')
            ->where('sender_id', $request->user()->id)
            ->firstOrFail();

        $message->delete();
        event(new OrderChatMessageDeleted($order->uuid, $messageId));

        return response()->json(null, 204);
    }
}
