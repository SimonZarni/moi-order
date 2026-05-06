<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Auth;

use App\DTOs\CompleteRegistrationDTO;
use App\DTOs\ResetPasswordDTO;
use App\DTOs\SendEmailOtpDTO;
use App\DTOs\VerifyEmailOtpDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CompleteRegistrationRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\SendEmailOtpRequest;
use App\Http\Requests\Auth\VerifyEmailOtpRequest;
use App\Http\Resources\UserResource;
use App\Services\EmailAuthService;
use App\Services\EmailOtpService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * All routes intentionally public (throttle:auth applied at route group level).
 */
class EmailAuthController extends Controller
{
    public function __construct(
        private readonly EmailOtpService  $emailOtpService,
        private readonly EmailAuthService $emailAuthService,
    ) {}

    /** POST /api/v1/auth/email/send-otp — intentionally public */
    public function sendOtp(SendEmailOtpRequest $request): JsonResponse
    {
        $result = $this->emailOtpService->send(SendEmailOtpDTO::fromRequest($request));

        return response()->json(['data' => $result]);
    }

    /** POST /api/v1/auth/email/verify-otp — intentionally public */
    public function verifyOtp(VerifyEmailOtpRequest $request): JsonResponse
    {
        $verifiedToken = $this->emailOtpService->verify(VerifyEmailOtpDTO::fromRequest($request));

        return response()->json(['data' => [
            'verified_token' => $verifiedToken,
            'expires_in'     => 900,
        ]]);
    }

    /** POST /api/v1/auth/email/register — intentionally public */
    public function completeRegistration(CompleteRegistrationRequest $request): JsonResponse
    {
        $result = $this->emailAuthService->completeRegistration(
            CompleteRegistrationDTO::fromRequest($request)
        );

        return response()->json([
            'data' => [
                'user'  => new UserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }

    /** POST /api/v1/auth/email/reset-password — intentionally public */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $this->emailAuthService->resetPassword(ResetPasswordDTO::fromRequest($request));

        return response()->json(null, 204);
    }
}
