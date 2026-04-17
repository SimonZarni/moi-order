<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateDynamicSubmissionDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDynamicSubmissionRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\DynamicSubmissionService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — auth enforced by middleware; user-scoped inside the service.
 */
class DynamicSubmissionController extends Controller
{
    public function __construct(
        private readonly DynamicSubmissionService $service,
    ) {}

    /** POST /api/v1/submissions/dynamic */
    public function store(StoreDynamicSubmissionRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateDynamicSubmissionDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
