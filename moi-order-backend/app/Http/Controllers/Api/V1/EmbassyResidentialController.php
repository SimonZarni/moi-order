<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateEmbassyResidentialDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmbassyResidentialRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\EmbassyResidentialService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — auth enforced by middleware; user-scoped inside the service.
 */
class EmbassyResidentialController extends Controller
{
    public function __construct(
        private readonly EmbassyResidentialService $service,
    ) {}

    /**
     * POST /api/v1/submissions/embassy-residential
     * Create a new embassy residential submission. Idempotent via idempotency_key.
     */
    public function store(StoreEmbassyResidentialRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateEmbassyResidentialDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
