<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\MerchantLoginDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\MerchantLoginRequest;
use App\Http\Resources\Merchant\MerchantUserResource;
use App\Services\MerchantAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class MerchantAuthController extends Controller
{
    public function __construct(
        private readonly MerchantAuthService $authService,
    ) {}

    /** POST /api/merchant/v1/auth/login — intentionally public */
    public function login(MerchantLoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(MerchantLoginDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/merchant/v1/auth/logout */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(null, 204);
    }

    /** GET /api/merchant/v1/auth/me */
    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => new MerchantUserResource($request->user())]);
    }
}
