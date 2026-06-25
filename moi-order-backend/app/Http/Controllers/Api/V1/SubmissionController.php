<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\CancelSubmissionRequest;
use App\Http\Requests\DeleteSubmissionRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Models\ServiceSubmission;
use App\Services\SubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — every query scoped to the authenticated user (scopeForUser).
 *   Route model binding is intentionally NOT used to enforce user-scoping.
 */
class SubmissionController extends Controller
{
    public function __construct(
        private readonly SubmissionService $service,
    ) {}

    /** GET /api/v1/submissions/active */
    public function active(Request $request): JsonResponse
    {
        $submissions = ServiceSubmission::with(['serviceType.service'])
            ->forUser($request->user()->id)
            ->whereNotIn('status', [SubmissionStatus::Completed->value, SubmissionStatus::Cancelled->value])
            ->latest()
            ->get();

        return response()->json([
            'data' => ServiceSubmissionResource::collection($submissions),
        ]);
    }

    /** GET /api/v1/submissions */
    public function index(Request $request): AnonymousResourceCollection
    {
        $submissions = ServiceSubmission::with(['serviceType.service'])
            ->forUser($request->user()->id)
            ->latest()
            ->paginate(20);

        return ServiceSubmissionResource::collection($submissions);
    }

    /** GET /api/v1/submissions/{id} */
    public function show(string $id, Request $request): JsonResponse
    {
        $submission = ServiceSubmission::with(['serviceType.service', 'documents.documentType', 'payment'])
            ->forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();

        return response()->json(['data' => new ServiceSubmissionResource($submission)]);
    }

    /** POST /api/v1/submissions/{id}/cancel */
    public function cancel(CancelSubmissionRequest $request, string $id): JsonResponse
    {
        $submission = ServiceSubmission::with(['serviceType.service'])
            ->forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();

        $submission = $this->service->cancelByCustomer($submission);

        return response()->json(['data' => new ServiceSubmissionResource($submission)]);
    }

    /** DELETE /api/v1/submissions/{id} */
    public function destroy(DeleteSubmissionRequest $request, string $id): JsonResponse
    {
        $submission = ServiceSubmission::forUser($request->user()->id)
            ->where('uuid', $id)
            ->firstOrFail();
        $this->service->deleteCancelled($submission);

        return response()->json(null, 204);
    }
}
