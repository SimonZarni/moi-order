<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminUpdateSubmissionStatusDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminSubmissionIndexRequest;
use App\Http\Requests\Admin\AdminUpdateSubmissionStatusRequest;
use App\Http\Resources\Admin\AdminSubmissionResource;
use App\Models\ServiceSubmission;
use App\Services\AdminSubmissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 * Principle: Security — admin.auth middleware guards all routes; never checked here.
 */
class AdminSubmissionController extends Controller
{
    public function __construct(
        private readonly AdminSubmissionService $service,
    ) {}

    /** GET /api/admin/v1/submissions */
    public function index(AdminSubmissionIndexRequest $request): AnonymousResourceCollection
    {
        return AdminSubmissionResource::collection(
            $this->service->index($request)
        );
    }

    /** GET /api/admin/v1/submissions/{submission} */
    public function show(ServiceSubmission $submission): JsonResponse
    {
        return response()->json([
            'data' => new AdminSubmissionResource(
                $this->service->show($submission)
            ),
        ]);
    }

    /** PATCH /api/admin/v1/submissions/{submission}/status */
    public function updateStatus(
        AdminUpdateSubmissionStatusRequest $request,
        ServiceSubmission $submission,
    ): JsonResponse {
        $updated = $this->service->updateStatus(
            $submission,
            AdminUpdateSubmissionStatusDTO::fromRequest($request),
        );

        return response()->json(['data' => new AdminSubmissionResource($updated)]);
    }
}
