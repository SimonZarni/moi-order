<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateEmbassyBankDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmbassyBankRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Services\EmbassyBankService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — auth enforced by middleware; user-scoped inside the service.
 */
class EmbassyBankController extends Controller
{
    public function __construct(
        private readonly EmbassyBankService $service,
    ) {}

    /**
     * POST /api/v1/submissions/embassy-bank
     * Create a new embassy bank submission. Idempotent via idempotency_key.
     */
    public function store(StoreEmbassyBankRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateEmbassyBankDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }
}
