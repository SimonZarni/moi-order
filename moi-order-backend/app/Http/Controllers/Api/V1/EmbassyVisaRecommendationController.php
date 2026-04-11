<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateEmbassyVisaRecommendationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmbassyVisaRecommendationRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\EmbassyVisaRecommendationService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — auth enforced by middleware; user-scoped inside the service.
 */
class EmbassyVisaRecommendationController extends Controller
{
    public function __construct(
        private readonly EmbassyVisaRecommendationService $service,
    ) {}

    /**
     * POST /api/v1/submissions/embassy-visa-recommendation
     * Create a new embassy visa recommendation submission. Idempotent via idempotency_key.
     */
    public function store(StoreEmbassyVisaRecommendationRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateEmbassyVisaRecommendationDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
