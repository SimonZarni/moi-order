<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateAirportFastTrackDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAirportFastTrackRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\AirportFastTrackService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — auth enforced by middleware; user-scoped inside the service.
 */
class AirportFastTrackController extends Controller
{
    public function __construct(
        private readonly AirportFastTrackService $service,
    ) {}

    /**
     * POST /api/v1/submissions/airport-fast-track
     * Create a new airport fast track submission. Idempotent via idempotency_key.
     */
    public function store(StoreAirportFastTrackRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateAirportFastTrackDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
