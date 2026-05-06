<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\AppleAuthDTO;
use App\DTOs\GoogleAuthDTO;
use App\DTOs\LineAuthDTO;
use App\DTOs\LoginDTO;
use App\DTOs\OtpRequestDTO;
use App\DTOs\OtpVerifyDTO;
use App\DTOs\RegisterDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppleAuthRequest;
use App\Http\Requests\CheckEmailRequest;
use App\Http\Requests\GoogleAuthRequest;
use App\Http\Requests\LineAuthRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\OtpRequestRequest;
use App\Http\Requests\OtpVerifyRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AppleAuthService;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Services\GoogleAuthService;
use App\Services\LineAuthService;
use App\Services\OtpAuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — auth enforced by middleware on logout/me; never inside controller.
 */
class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService      $authService,
        private readonly GoogleAuthService $googleAuthService,
        private readonly AppleAuthService $appleAuthService,
        private readonly LineAuthService  $lineAuthService,
        private readonly OtpAuthService   $otpAuthService,
    ) {}

    /** POST /api/v1/auth/check-email — intentionally public */
    public function checkEmail(CheckEmailRequest $request): JsonResponse
    {
        $method = $this->authService->checkEmail($request->validated('email'));

        return response()->json(['data' => ['method' => $method]]);
    }

    /** POST /api/v1/auth/login — intentionally public */
    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login(LoginDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/v1/auth/register — intentionally public */
    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register(RegisterDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }

    /** POST /api/v1/auth/google — intentionally public */
    public function googleAuth(GoogleAuthRequest $request): JsonResponse
    {
        $result = $this->googleAuthService->authenticate(GoogleAuthDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/v1/auth/apple — intentionally public */
    public function appleAuth(AppleAuthRequest $request): JsonResponse
    {
        $result = $this->appleAuthService->authenticate(AppleAuthDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/v1/auth/line — intentionally public */
    public function lineAuth(LineAuthRequest $request): JsonResponse
    {
        $result = $this->lineAuthService->authenticate(LineAuthDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/v1/auth/otp/request — intentionally public */
    public function requestOtp(OtpRequestRequest $request): JsonResponse
    {
        return response()->json([
            'data' => $this->otpAuthService->requestOtp(OtpRequestDTO::fromRequest($request)),
        ]);
    }

    /** POST /api/v1/auth/otp/verify — intentionally public */
    public function verifyOtp(OtpVerifyRequest $request): JsonResponse
    {
        $result = $this->otpAuthService->verifyOtp(OtpVerifyDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/v1/auth/logout — requires auth:sanctum */
    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return response()->json(null, 204);
    }

    /** GET /api/v1/auth/me — requires auth:sanctum */
    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => new UserResource($request->user())]);
    }
}
