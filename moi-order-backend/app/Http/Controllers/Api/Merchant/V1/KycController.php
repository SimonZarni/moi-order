<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\KycApplicationDTO;
use App\Enums\KycDocumentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\CreateKycApplicationRequest;
use App\Http\Requests\Merchant\UploadKycDocumentRequest;
use App\Http\Resources\Merchant\KycApplicationResource;
use App\Http\Resources\Merchant\KycDocumentResource;
use App\Services\KycService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — all queries scoped to auth user via KycService.getOrCreateApplication().
 */
class KycController extends Controller
{
    public function __construct(
        private readonly KycService $kycService,
    ) {}

    /** GET /api/merchant/v1/kyc */
    public function show(Request $request): JsonResponse
    {
        $app = $this->kycService->getOrCreateApplication($request->user());
        $app->load('documents');

        return response()->json(['data' => new KycApplicationResource($app)]);
    }

    /** POST /api/merchant/v1/kyc */
    public function upsert(CreateKycApplicationRequest $request): JsonResponse
    {
        $app = $this->kycService->getOrCreateApplication($request->user());
        $app = $this->kycService->updateApplication($app, KycApplicationDTO::fromRequest($request));
        $app->load('documents');

        return response()->json(['data' => new KycApplicationResource($app)]);
    }

    /** POST /api/merchant/v1/kyc/documents */
    public function uploadDocument(UploadKycDocumentRequest $request): JsonResponse
    {
        $app  = $this->kycService->getOrCreateApplication($request->user());
        $type = KycDocumentType::from($request->validated('type'));
        $doc  = $this->kycService->uploadDocument($app, $request->file('file'), $type);

        return response()->json(['data' => new KycDocumentResource($doc)], 201);
    }

    /** POST /api/merchant/v1/kyc/submit */
    public function submit(Request $request): JsonResponse
    {
        $app = $this->kycService->getOrCreateApplication($request->user());
        $app = $this->kycService->submit($app);
        $app->load('documents');

        return response()->json(['data' => new KycApplicationResource($app)]);
    }
}
