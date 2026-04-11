<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\DTOs\CreateNinetyDayReportDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNinetyDayReportRequest;
use App\Http\Resources\ServiceSubmissionResource;
use App\Models\ServiceSubmission;
use App\Services\NinetyDayReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. One service call per action. ≤20 lines/action.
 * Principle: Security — every query scoped to the authenticated user (scopeForUser).
 *   Route model binding is intentionally NOT used for show() to enforce user-scoping.
 */
class SubmissionController extends Controller
{
    public function __construct(
        private readonly NinetyDayReportService $service,
    ) {}

    /**
     * POST /api/v1/submissions/90-day-report
     * Create a new 90-day report submission. Idempotent via idempotency_key.
     */
    public function store(StoreNinetyDayReportRequest $request): JsonResponse
    {
        $submission = $this->service->create(CreateNinetyDayReportDTO::fromRequest($request));

        return response()->json(['data' => new ServiceSubmissionResource($submission)], 201);
    }

    /**
     * GET /api/v1/submissions
     * Paginated list of the authenticated user's submissions (lightweight, no documents).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $submissions = ServiceSubmission::with(['serviceType.service'])
            ->forUser($request->user()->id)
            ->latest()
            ->paginate(20);

        return ServiceSubmissionResource::collection($submissions);
    }

    /**
     * GET /api/v1/submissions/{id}
     * Full submission detail including applicant info and signed document URLs.
     */
    public function show(int $id, Request $request): JsonResponse
    {
        $submission = ServiceSubmission::with([
            'serviceType.service',
            'ninetyDayReportDetail',
            'companyRegistrationDetail',
            'airportFastTrackDetail',
            'embassyResidentialDetail',
            'documents',
        ])
            ->forUser($request->user()->id)
            ->findOrFail($id);

        return response()->json(['data' => new ServiceSubmissionResource($submission)]);
    }
}
