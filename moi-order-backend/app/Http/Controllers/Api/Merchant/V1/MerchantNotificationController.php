<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Merchant\MerchantNotificationResource;
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
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min((int) ($request->query('per_page', 20)), 50);

        $notifications = MerchantNotification::forMerchant($request->user()->id)
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return MerchantNotificationResource::collection($notifications);
    }

    /**
     * GET /api/merchant/v1/notifications/unread-count
     * Lightweight count for the notification bell badge.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = MerchantNotification::forMerchant($request->user()->id)
            ->unread()
            ->count();

        return response()->json(['data' => ['unread_count' => $count]]);
    }

    /**
     * POST /api/merchant/v1/notifications/{id}/read
     * Mark a single notification read.  Idempotent.
     */
    public function markRead(Request $request, int $id): JsonResponse
    {
        $notification = MerchantNotification::forMerchant($request->user()->id)
            ->findOrFail($id);

        $notification->markRead();

        return response()->json(['data' => new MerchantNotificationResource($notification)]);
    }

    /**
     * POST /api/merchant/v1/notifications/read-all
     * Bulk-mark all unread notifications read.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        MerchantNotification::forMerchant($request->user()->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json(['data' => ['message' => 'All notifications marked as read.']]);
    }
}
