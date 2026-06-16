<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Merchant\MerchantNotificationResource;
use App\Models\FoodOrder;
use App\Models\MerchantNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only; all business logic (markRead) lives on the Model.
 * Principle: Security — every query scoped to authenticated merchant via scopeForMerchant().
 * HTTP codes: 200 read, 204 mutate-no-content, 404 not found.
 */
class MerchantNotificationController extends Controller
{
    /**
     * GET /api/merchant/v1/notifications
     * Paginated list, newest first.  per_page default 20, max 50.
     * Optional ?group=orders (default) or ?group=chat to filter by notification group.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) ($request->query('per_page', 20)), 50);
        $group   = $request->query('group', 'orders');

        $query = MerchantNotification::forMerchant($request->user()->id)
            ->with('order')
            ->orderByDesc('created_at');

        if ($group === 'chat') {
            $query->where('type', 'chat_message');
        } else {
            $query->where('type', '!=', 'chat_message');
        }

        return MerchantNotificationResource::collection($query->paginate($perPage));
    }

    /**
     * GET /api/merchant/v1/notifications/unread-count
     * Lightweight count for the notification bell badge.
     * Optional ?group=orders (default) or ?group=chat.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $group = $request->query('group', 'orders');

        $query = MerchantNotification::forMerchant($request->user()->id)->unread();

        if ($group === 'chat') {
            $query->where('type', 'chat_message');
        } else {
            $query->where('type', '!=', 'chat_message');
        }

        return response()->json(['data' => ['unread_count' => $query->count()]]);
    }

    /**
     * POST /api/merchant/v1/notifications/{id}/read
     * Mark a single notification read.  Idempotent.
     */
    public function markRead(Request $request, int $id): JsonResponse
    {
        $notification = MerchantNotification::forMerchant($request->user()->id)
            ->with('order')
            ->findOrFail($id);

        $notification->markRead();

        return response()->json(['data' => new MerchantNotificationResource($notification)]);
    }

    /**
     * POST /api/merchant/v1/notifications/read-all
     * Bulk-mark unread notifications read.
     * Optional ?group=orders (default) or ?group=chat.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        $group = $request->query('group', 'orders');

        $query = MerchantNotification::forMerchant($request->user()->id)->unread();

        if ($group === 'chat') {
            $query->where('type', 'chat_message');
        } else {
            $query->where('type', '!=', 'chat_message');
        }

        $query->update(['read_at' => now()]);

        return response()->json(['data' => ['message' => 'All notifications marked as read.']]);
    }

    /**
     * POST /api/merchant/v1/notifications/read-by-order/{uuid}
     * Mark all unread notifications for a given order as read.
     * Used when a merchant opens an order from the orders page (not via notifications).
     */
    public function readByOrder(Request $request, string $uuid): JsonResponse
    {
        $order = FoodOrder::where('uuid', $uuid)->first();

        if ($order !== null) {
            MerchantNotification::forMerchant($request->user()->id)
                ->where('order_id', $order->id)
                ->unread()
                ->update(['read_at' => now()]);
        }

        return response()->json(['data' => ['message' => 'OK']]);
    }
}
