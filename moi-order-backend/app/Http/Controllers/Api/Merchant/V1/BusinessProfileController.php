<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\UpdateBusinessProfileDTO;
use App\Enums\KycDocumentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\UpdateBusinessProfileRequest;
use App\Http\Requests\Merchant\UploadProfileDocumentRequest;
use App\Http\Resources\Merchant\BusinessProfileResource;
use App\Http\Resources\Merchant\KycDocumentResource;
use App\Services\BusinessProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — auth enforced by middleware; all queries user-scoped in Service.
 */
class BusinessProfileController extends Controller
{
    public function __construct(
        private readonly BusinessProfileService $businessProfileService,
    ) {}

    /** GET /api/merchant/v1/business-profile */
    public function show(Request $request): JsonResponse
    {
        $profile = $this->businessProfileService->getProfile($request->user());

        return response()->json(['data' => new BusinessProfileResource($profile)]);
    }

    /** PATCH /api/merchant/v1/business-profile */
    public function update(UpdateBusinessProfileRequest $request): JsonResponse
    {
        $profile = $this->businessProfileService->updateBusinessPhone(
            $request->user(),
            UpdateBusinessProfileDTO::fromRequest($request),
        );

        return response()->json(['data' => new BusinessProfileResource($profile)]);
    }

    /** POST /api/merchant/v1/business-profile/documents */
    public function uploadDocument(UploadProfileDocumentRequest $request): JsonResponse
    {
        $type = KycDocumentType::from($request->validated('type'));
        $doc  = $this->businessProfileService->replaceDocument(
            $request->user(),
            $request->file('file'),
            $type,
        );

        return response()->json(['data' => new KycDocumentResource($doc)], 201);
    }
}
