<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\MerchantVerifyEmailConfirmDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\MerchantVerifyEmailConfirmRequest;
use App\Http\Resources\Merchant\MerchantUserResource;
use App\Services\MerchantEmailVerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Both routes are authenticated (auth:sanctum + abilities:merchant middleware).
 */
class MerchantEmailVerificationController extends Controller
{
    public function __construct(
        private readonly MerchantEmailVerificationService $service,
    ) {}

    /** POST /api/merchant/v1/profile/verify-email/send */
    public function send(Request $request): JsonResponse
    {
        $result = $this->service->send($request->user());

        return response()->json(['data' => $result]);
    }

    /** POST /api/merchant/v1/profile/verify-email/confirm */
    public function confirm(MerchantVerifyEmailConfirmRequest $request): JsonResponse
    {
        $this->service->confirm(
            $request->user(),
            MerchantVerifyEmailConfirmDTO::fromRequest($request)->otp,
            MerchantVerifyEmailConfirmDTO::fromRequest($request)->newPassword,
        );

        return response()->json(['data' => new MerchantUserResource($request->user()->fresh())]);
    }
}
