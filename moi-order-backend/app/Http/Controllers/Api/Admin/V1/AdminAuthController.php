<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminLoginDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Http\Resources\Admin\AdminUserResource;
use App\Services\AdminAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — auth enforced by middleware on logout/me; never inside controller.
 */
class AdminAuthController extends Controller
{
    public function __construct(
        private readonly AdminAuthService $authService,
    ) {}

    /** POST /api/admin/v1/auth/login — intentionally public */
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(AdminLoginDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new AdminUserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/admin/v1/auth/logout — requires auth:sanctum + admin.auth */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(null, 204);
    }

    /** GET /api/admin/v1/auth/me — requires auth:sanctum + admin.auth */
    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => new AdminUserResource($request->user())]);
    }
}
