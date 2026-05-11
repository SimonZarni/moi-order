<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminLoginDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use App\Http\Requests\Admin\UpdateAdminPasswordRequest;
use App\Http\Resources\Admin\AdminUserResource;
use App\Services\AdminAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Cookie;

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
        $result['user']->loadMissing('adminRole.permissions');

        // Token is written into an httpOnly cookie — never returned in the JSON body.
        // JS on the admin dashboard cannot read this cookie; the browser attaches it
        // automatically, and AdminTokenFromCookie middleware converts it to a Bearer header.
        // SameSite=None is required because the admin dashboard (vercel.app) and the API
        // (moiorder.com) are different registrable domains — Lax silently blocks cross-domain
        // AJAX cookie sending. None requires Secure=true (enforced below).
        $cookie = new Cookie(
            name: 'admin_token',
            value: $result['token'],
            expire: time() + (8 * 60 * 60), // matches createToken() expiry in AdminAuthService
            path: '/api/admin',
            domain: config('session.domain'),
            secure: true,
            httpOnly: true,
            raw: false,
            sameSite: Cookie::SAMESITE_NONE,
        );

        return response()->json([
            'data' => [
                'user'  => new AdminUserResource($result['user']),
                'token' => $result['token'],
            ],
        ])->withCookie($cookie);
    }

    /** POST /api/admin/v1/auth/logout — requires auth:sanctum + admin.auth */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        $expired = new Cookie(
            name: 'admin_token',
            value: '',
            expire: 1,
            path: '/api/admin',
            domain: config('session.domain'),
            secure: true,
            httpOnly: true,
            raw: false,
            sameSite: Cookie::SAMESITE_NONE,
        );

        return response()->json(null, 204)->withCookie($expired);
    }

    /** GET /api/admin/v1/auth/me — requires auth:sanctum + admin.auth */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->loadMissing('adminRole.permissions');

        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /** PUT /api/admin/v1/auth/password — requires auth:sanctum + admin.auth */
    public function changePassword(UpdateAdminPasswordRequest $request): JsonResponse
    {
        $this->authService->changePassword(
            $request->user(),
            $request->validated('current_password'),
            $request->validated('new_password'),
        );

        return response()->json(null, 204);
    }
}
