<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminUpdateSubmissionStatusDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminSubmissionIndexRequest;
use App\Http\Requests\Admin\AdminUpdateSubmissionStatusRequest;
use App\Http\Requests\Admin\UploadEticketRequest;
use App\Http\Resources\Admin\AdminSubmissionResource;
use App\Models\ServiceSubmission;
use App\Services\AdminSubmissionService;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

    /** POST /api/admin/v1/submissions/{submission}/result */
    public function uploadResultFile(UploadEticketRequest $request, ServiceSubmission $submission): JsonResponse
    {
        $updated = $this->service->uploadResultFile($submission, $request->file('eticket'));

        return response()->json(['data' => new AdminSubmissionResource($updated)]);
    }

    /**
     * GET /api/admin/v1/submissions/{submission}/result
     * Streams the file directly for admin preview/download.
     */
    public function downloadResultFile(ServiceSubmission $submission): StreamedResponse
    {
        abort_if($submission->result_path === null, 404, 'No result file uploaded for this submission.');

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk(config('filesystems.default', 'local'));

        abort_if(! $disk->exists($submission->result_path), 404, 'Result file not found.');

        $path     = strtolower($submission->result_path);
        $mimeType = match (true) {
            str_ends_with($path, '.pdf')          => 'application/pdf',
            str_ends_with($path, '.png')          => 'image/png',
            default                               => 'image/jpeg',
        };
        $ext      = str_ends_with($path, '.pdf') ? 'pdf' : (str_ends_with($path, '.png') ? 'png' : 'jpg');
        $filename = 'result-'.$submission->id.'.'.$ext;

        return $disk->response($submission->result_path, $filename, [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'inline; filename="'.$filename.'"',
        ]);
    }
}
