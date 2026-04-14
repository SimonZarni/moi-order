<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateTestServiceDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestServiceRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\TestService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 */
class TestServiceController extends Controller
{
    public function __construct(
        private readonly TestService $service,
    ) {}

    /**
     * POST /api/v1/submissions/test-service
     */
    public function store(StoreTestServiceRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateTestServiceDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
