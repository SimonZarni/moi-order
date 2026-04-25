<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\RegisterDeviceTokenRequest;
use App\Http\Requests\Api\V1\UnregisterDeviceTokenRequest;
use App\Models\DeviceToken;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer for device token registration only.
 * Principle: Security — every query scoped to the authenticated user;
 *   a user can never unregister another user's token.
 *
 * Duplicate prevention: store() uses updateOrCreate on the unique token column.
 *   Same device re-registering (app reinstall, token refresh) upserts in place
 *   rather than creating a duplicate row — no extra push per notification.
 */
class DeviceTokenController extends Controller
{
    /** POST /api/v1/device-tokens — register or refresh a device token */
    public function store(RegisterDeviceTokenRequest $request): JsonResponse
    {
        DeviceToken::updateOrCreate(
            ['token'   => $request->validated('token')],
            ['user_id' => $request->user()->id, 'platform' => $request->validated('platform')],
        );

        return response()->json(null, 204);
    }

    /** DELETE /api/v1/device-tokens — unregister a device token on logout */
    public function destroy(UnregisterDeviceTokenRequest $request): JsonResponse
    {
        DeviceToken::where('user_id', $request->user()->id)
            ->where('token', $request->validated('token'))
            ->delete();

        return response()->json(null, 204);
    }
}
