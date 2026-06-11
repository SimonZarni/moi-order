<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\AppleAuthDTO;
use App\DTOs\GoogleAuthDTO;
use App\DTOs\LineAuthDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\AppleAuthRequest;
use App\Http\Requests\GoogleAuthRequest;
use App\Http\Requests\LineAuthRequest;
use App\Http\Requests\LineWebAuthRequest;
use App\Http\Resources\Merchant\MerchantUserResource;
use App\Services\MerchantSocialAuthService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * All routes intentionally public — provider token is the credential.
 */
class MerchantSocialAuthController extends Controller
{
    public function __construct(
        private readonly MerchantSocialAuthService $service,
    ) {}

    /** POST /api/merchant/v1/auth/google — intentionally public */
    public function google(GoogleAuthRequest $request): JsonResponse
    {
        $result = $this->service->authenticateGoogle(GoogleAuthDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/merchant/v1/auth/apple — intentionally public */
    public function apple(AppleAuthRequest $request): JsonResponse
    {
        $result = $this->service->authenticateApple(AppleAuthDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/merchant/v1/auth/line — intentionally public */
    public function line(LineAuthRequest $request): JsonResponse
    {
        $result = $this->service->authenticateLine(LineAuthDTO::fromRequest($request));

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }

    /** POST /api/merchant/v1/auth/line/web — web OAuth code exchange, intentionally public */
    public function lineWeb(LineWebAuthRequest $request): JsonResponse
    {
        $result = $this->service->authenticateLineWeb(
            code:        $request->string('code')->toString(),
            redirectUri: $request->string('redirect_uri')->toString(),
            nonce:       $request->string('nonce')->toString() ?: null,
        );

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ]);
    }
}
