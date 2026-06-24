<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Http\Controllers\Controller;
use App\Http\DTOs\StorePushSubscriptionDTO;
use App\Http\Requests\Merchant\DeletePushSubscriptionRequest;
use App\Http\Requests\Merchant\StorePushSubscriptionRequest;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer for merchant browser push subscription management only.
 * Principle: Security — every query scoped to the authenticated merchant user;
 *   a merchant can never delete another merchant's subscription.
 *
 * Reuses the shared push_subscriptions table — merchant user IDs are distinct from
 * admin user IDs, so there is no collision risk without a guard discriminator column.
 *
 * Duplicate prevention: store() uses updateOrCreate keyed on (user_id, endpoint).
 *   Re-subscribing (page reload, key rotation) upserts keys in place rather than
 *   creating a duplicate row — prevents double notifications.
 */
class MerchantPushSubscriptionController extends Controller
{
    /** POST /api/merchant/v1/push-subscriptions — register or refresh a browser subscription */
    public function store(StorePushSubscriptionRequest $request): JsonResponse
    {
        $dto    = StorePushSubscriptionDTO::fromRequest($request);
        $userId = $request->user()->id;

        PushSubscription::updateOrCreate(
            ['user_id'  => $userId, 'endpoint' => $dto->endpoint],
            ['p256dh_key' => $dto->p256dhKey, 'auth_key' => $dto->authKey],
        );

        return response()->json(null, 204);
    }

    /** DELETE /api/merchant/v1/push-subscriptions — unregister a subscription (logout / permission revoked) */
    public function destroy(DeletePushSubscriptionRequest $request): JsonResponse
    {
        PushSubscription::where('user_id', $request->user()->id)
            ->where('endpoint', $request->validated('endpoint'))
            ->delete();

        return response()->json(null, 204);
    }
}
