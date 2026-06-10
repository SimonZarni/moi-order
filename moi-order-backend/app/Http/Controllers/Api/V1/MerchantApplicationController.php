<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Merchant\KycApplicationResource;
use App\Services\KycService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — auth enforced by middleware (auth:sanctum, abilities:user).
 */
class MerchantApplicationController extends Controller
{
    public function __construct(
        private readonly KycService $kycService,
    ) {}

    /** POST /api/v1/merchant/apply — existing customer applies to become a merchant */
    public function store(Request $request): JsonResponse
    {
        $application = $this->kycService->applyForMerchant($request->user());

        return response()->json(['data' => new KycApplicationResource($application)]);
    }

    /** GET /api/v1/merchant/apply — current user's latest application status, or null */
    public function show(Request $request): JsonResponse
    {
        $application = $this->kycService->getLatestApplication($request->user());

        return response()->json([
            'data' => $application !== null ? new KycApplicationResource($application) : null,
        ]);
    }

    /** DELETE /api/v1/merchant/apply — withdraw a draft application */
    public function destroy(Request $request): JsonResponse
    {
        $this->kycService->cancelApplication($request->user());

        return response()->json(null, 204);
    }
}
