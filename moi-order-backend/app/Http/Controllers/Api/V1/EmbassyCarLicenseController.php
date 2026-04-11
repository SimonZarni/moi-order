<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateEmbassyCarLicenseDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmbassyCarLicenseRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\EmbassyCarLicenseService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — auth enforced by middleware; user-scoped inside the service.
 */
class EmbassyCarLicenseController extends Controller
{
    public function __construct(
        private readonly EmbassyCarLicenseService $service,
    ) {}

    /**
     * POST /api/v1/submissions/embassy-car-license
     * Create a new embassy car license submission. Idempotent via idempotency_key.
     */
    public function store(StoreEmbassyCarLicenseRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateEmbassyCarLicenseDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
