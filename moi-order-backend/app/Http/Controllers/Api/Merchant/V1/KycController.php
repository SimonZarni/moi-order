<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\DTOs\KycApplicationDTO;
use App\Enums\KycDocumentType;
use App\Models\KycApplication;
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

    /** POST /api/merchant/v1/kyc/resubmit — request name/address change */
    public function resubmit(Request $request): JsonResponse
    {
        $request->validate([
            'business_name'    => ['required', 'string', 'max:255'],
            'business_address' => ['required', 'string', 'max:500'],
        ]);

        $app = $this->kycService->createResubmission(
            $request->user(),
            $request->validated('business_name'),
            $request->validated('business_address'),
        );

        return response()->json(['data' => new KycApplicationResource($app)], 201);
    }

    /** POST /api/merchant/v1/kyc/resubmit/{id}/documents — upload doc to a resubmission */
    public function uploadResubmitDocument(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'type' => ['required', 'string'],
            'file' => ['required', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:10240'],
        ]);

        $app = KycApplication::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('type', 'resubmission')
            ->firstOrFail();

        $type = KycDocumentType::from($request->validated('type'));
        $doc  = $this->kycService->uploadDocument($app, $request->file('file'), $type);

        return response()->json(['data' => new KycDocumentResource($doc)], 201);
    }

    /** POST /api/merchant/v1/kyc/resubmit/{id}/submit */
    public function submitResubmission(Request $request, int $id): JsonResponse
    {
        $app = KycApplication::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->where('type', 'resubmission')
            ->firstOrFail();

        $app = $this->kycService->submit($app);

        return response()->json(['data' => new KycApplicationResource($app)]);
    }
}
