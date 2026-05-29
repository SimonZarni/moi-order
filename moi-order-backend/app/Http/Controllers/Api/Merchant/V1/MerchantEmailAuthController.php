<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\MerchantCompleteRegistrationDTO;
use App\DTOs\MerchantSendRegisterOtpDTO;
use App\DTOs\MerchantVerifyRegisterOtpDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\MerchantCompleteRegistrationRequest;
use App\Http\Requests\Merchant\MerchantSendRegisterOtpRequest;
use App\Http\Requests\Merchant\MerchantVerifyRegisterOtpRequest;
use App\Http\Resources\Merchant\MerchantUserResource;
use App\Services\MerchantEmailAuthService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * All routes intentionally public (throttle:auth applied at route group level).
 */
class MerchantEmailAuthController extends Controller
{
    public function __construct(
        private readonly MerchantEmailAuthService $service,
    ) {}

    /** POST /api/merchant/v1/auth/email/send-otp — intentionally public */
    public function sendOtp(MerchantSendRegisterOtpRequest $request): JsonResponse
    {
        $result = $this->service->sendRegisterOtp(MerchantSendRegisterOtpDTO::fromRequest($request));

        return response()->json(['data' => $result]);
    }

    /** POST /api/merchant/v1/auth/email/verify-otp — intentionally public */
    public function verifyOtp(MerchantVerifyRegisterOtpRequest $request): JsonResponse
    {
        $result = $this->service->verifyRegisterOtp(MerchantVerifyRegisterOtpDTO::fromRequest($request));

        return response()->json(['data' => $result]);
    }

    /** POST /api/merchant/v1/auth/email/register — intentionally public */
    public function completeRegistration(MerchantCompleteRegistrationRequest $request): JsonResponse
    {
        $result = $this->service->completeRegistration(MerchantCompleteRegistrationDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }
}
