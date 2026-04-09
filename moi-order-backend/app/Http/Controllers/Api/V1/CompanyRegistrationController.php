<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateCompanyRegistrationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompanyRegistrationRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\CompanyRegistrationService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — auth enforced by middleware; user-scoped inside the service.
 */
class CompanyRegistrationController extends Controller
{
    public function __construct(
        private readonly CompanyRegistrationService $service,
    ) {}

    /**
     * POST /api/v1/submissions/company-registration
     * Create a new company registration submission. Idempotent via idempotency_key.
     */
    public function store(StoreCompanyRegistrationRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateCompanyRegistrationDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
