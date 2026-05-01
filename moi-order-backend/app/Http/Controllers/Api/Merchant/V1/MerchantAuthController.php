<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\MerchantLoginDTO;
use App\DTOs\MerchantOtpRequestDTO;
use App\DTOs\MerchantOtpVerifyDTO;
use App\DTOs\SelfRegisterMerchantDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\MerchantLoginRequest;
use App\Http\Requests\Merchant\MerchantOtpRequestRequest;
use App\Http\Requests\Merchant\MerchantOtpVerifyRequest;
use App\Http\Requests\Merchant\SelfRegisterMerchantRequest;
use App\Http\Resources\Merchant\MerchantUserResource;
use App\Services\MerchantAuthService;
use App\Services\MerchantOtpService;
use App\Services\MerchantRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class MerchantAuthController extends Controller
{
    public function __construct(
        private readonly MerchantAuthService $authService,
        private readonly MerchantOtpService $merchantOtpService,
        private readonly MerchantRegistrationService $registrationService,
    ) {}

    /** POST /api/merchant/v1/auth/register — intentionally public */
    public function register(SelfRegisterMerchantRequest $request): JsonResponse
    {
        $result = $this->registrationService->selfRegister(SelfRegisterMerchantDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }

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

    /** POST /api/merchant/v1/auth/otp/request — intentionally public */
    public function otpRequest(MerchantOtpRequestRequest $request): JsonResponse
    {
        $result = $this->merchantOtpService->requestOtp(MerchantOtpRequestDTO::fromRequest($request));

        return response()->json(['data' => $result]);
    }

    /** POST /api/merchant/v1/auth/otp/verify — intentionally public */
    public function otpVerify(MerchantOtpVerifyRequest $request): JsonResponse
    {
        $result = $this->merchantOtpService->verifyOtp(MerchantOtpVerifyDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'       => new MerchantUserResource($result['user']),
                'token'      => $result['token'],
                'kyc_status' => $result['kyc_status'],
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
