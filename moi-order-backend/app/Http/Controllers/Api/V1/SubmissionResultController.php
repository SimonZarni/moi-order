<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Models\ServiceSubmission;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Principle: SRP — generates result file download URL only.
 * Security: signed URL with 30-min TTL; only available once submission is completed.
 *   Query scoped to authenticated user — no cross-user access.
 */
class SubmissionResultController extends Controller
{
    public function __construct(
        private readonly FileStorageInterface $fileStorage,
    ) {}

    /** GET /api/v1/submissions/{id}/result */
    public function show(int $id, Request $request): JsonResponse
    {
        $submission = ServiceSubmission::forUser($request->user()->id)->findOrFail($id);

        abort_if(
            $submission->status !== SubmissionStatus::Completed || $submission->result_path === null,
            409,
            'Result file is not yet available for this submission.',
        );

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk(config('filesystems.default', 'local'));

        abort_if(! $disk->exists($submission->result_path), 404, 'Result file not found. Please contact support.');

        $url      = $this->fileStorage->url($submission->result_path, 30);
        $path     = strtolower($submission->result_path);
        $mimeType = match (true) {
            str_ends_with($path, '.pdf') => 'application/pdf',
            str_ends_with($path, '.png') => 'image/png',
            default                      => 'image/jpeg',
        };

        return response()->json(['data' => ['url' => $url, 'mime_type' => $mimeType]]);
    }
}
