<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Events\OrderChatMessageSent;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrderChatMessageRequest;
use App\Http\Resources\OrderChatMessageResource;
use App\Models\Admin;
use App\Models\FoodOrder;
use App\Models\OrderChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrderChatController extends Controller
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    /** GET /api/admin/v1/food-orders/{foodOrderId}/chat */
    public function index(Request $request, int $foodOrderId): JsonResponse
    {
        $order = FoodOrder::findOrFail($foodOrderId);

        $messages = OrderChatMessage::query()
            ->forOrder($order->id)
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $messages->map(fn ($m) => (new OrderChatMessageResource($m, $this->storage))->toArray($request))->values(),
        ]);
    }

    /** POST /api/admin/v1/food-orders/{foodOrderId}/chat */
    public function store(StoreOrderChatMessageRequest $request, int $foodOrderId): JsonResponse
    {
        $order = FoodOrder::findOrFail($foodOrderId);

        /** @var Admin $admin */
        $admin = $request->user();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->storage->store(
                $request->file('image'),
                'chat-images',
                ['image/jpeg', 'image/png', 'image/webp'],
            );
        }

        $message = OrderChatMessage::create([
            'food_order_id' => $order->id,
            'sender_type'   => 'admin',
            'sender_id'     => $admin->id,
            'sender_name'   => $admin->name,
            'body'          => $request->filled('body') ? $request->string('body')->toString() : null,
            'image_path'    => $imagePath,
        ]);

        event(new OrderChatMessageSent($message));

        return response()->json(
            ['data' => new OrderChatMessageResource($message, $this->storage)],
            201,
        );
    }
}
