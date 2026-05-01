<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminCreateMerchantDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateAdminMerchantRequest;
use App\Http\Resources\Merchant\MerchantUserResource;
use App\Services\MerchantRegistrationService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — admin.auth middleware asserts is_admin before any action.
 */
class AdminMerchantCreateController extends Controller
{
    public function __construct(
        private readonly MerchantRegistrationService $registrationService,
    ) {}

    /** POST /api/admin/v1/merchants */
    public function store(CreateAdminMerchantRequest $request): JsonResponse
    {
        $result = $this->registrationService->adminCreateMerchant(
            AdminCreateMerchantDTO::fromRequest($request),
            $request->user(),
        );

        return response()->json([
            'data' => [
                'user'  => new MerchantUserResource($result['user']),
                'token' => $result['token'],
            ],
        ], 201);
    }
}
