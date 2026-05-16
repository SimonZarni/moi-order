<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\DTOs\StorePushSubscriptionDTO;
use App\Http\Requests\Admin\DeletePushSubscriptionRequest;
use App\Http\Requests\Admin\StorePushSubscriptionRequest;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer for admin browser push subscription management only.
 * Principle: Security — every query scoped to the authenticated admin user;
 *   an admin can never delete another admin's subscription.
 *
 * Duplicate prevention: store() uses updateOrCreate keyed on (user_id, endpoint).
 *   Re-subscribing (page reload, key rotation) upserts the keys in place rather
 *   than creating a duplicate row — prevents double notifications.
 */
class AdminPushSubscriptionController extends Controller
{
    /** POST /api/admin/v1/push-subscriptions — register or refresh a browser subscription */
    public function store(StorePushSubscriptionRequest $request): JsonResponse
    {
        $dto    = StorePushSubscriptionDTO::fromRequest($request);
        $userId = $request->user()->id;

        // Upsert this device's subscription only — never delete other endpoints.
        // Each device (iPhone PWA, Mac browser, Windows Chrome, etc.) registers
        // its own subscription and all must receive notifications simultaneously.
        // Stale/expired endpoints are removed naturally when the push service
        // returns 410 Gone on a failed delivery.
        PushSubscription::updateOrCreate(
            ['user_id'  => $userId, 'endpoint' => $dto->endpoint],
            ['p256dh_key' => $dto->p256dhKey, 'auth_key' => $dto->authKey],
        );

        return response()->json(null, 204);
    }

    /** DELETE /api/admin/v1/push-subscriptions — unregister a subscription (logout / permission revoked) */
    public function destroy(DeletePushSubscriptionRequest $request): JsonResponse
    {
        PushSubscription::where('user_id', $request->user()->id)
            ->where('endpoint', $request->validated('endpoint'))
            ->delete();

        return response()->json(null, 204);
    }
}
