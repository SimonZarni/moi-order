<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\AdminUpdateSubmissionStatusDTO;
use App\Enums\SubmissionStatus;
use App\Exceptions\DomainException;
use App\Http\Requests\Admin\AdminSubmissionIndexRequest;
use App\Models\ServiceSubmission;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Principle: SRP — owns admin-side submission business logic only.
 *   No user scoping: admin sees all submissions.
 * Principle: Security — status transitions validated here; model domain methods
 *   provide a second guard layer (defence in depth).
 *
 * Status transition rules:
 *   pending_payment → cancelled   (admin cancels before payment clears)
 *   processing      → completed   (admin marks work done)
 *   processing      → cancelled   (admin cancels in-progress submission)
 *   completed/cancelled → 409 DomainException (terminal states)
 */
class AdminSubmissionService
{
    public function __construct(
        private readonly FileStorageInterface $fileStorage,
    ) {}

    /**
     * Paginated list with optional filters.
     * Index deliberately excludes heavy detail relations — those are for show() only.
     */
    public function index(AdminSubmissionIndexRequest $request): LengthAwarePaginator
    {
        $query = ServiceSubmission::with([
            'user',
            'serviceType' => fn ($q) => $q->withTrashed()->with(['service' => fn ($q) => $q->withTrashed()]),
            'payment',
        ])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('service_id')) {
            $query->whereHas('serviceType', function ($q) use ($request): void {
                $q->where('service_id', $request->integer('service_id'));
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from')->toString());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to')->toString());
        }

        if ($request->filled('search')) {
            $term = $request->string('search')->toString();
            $query->where(function ($q) use ($term): void {
                $q->where('id', $term)
                    ->orWhereHas('user', function ($uq) use ($term): void {
                        $uq->where('email', 'like', "%{$term}%")
                            ->orWhere('name', 'like', "%{$term}%");
                    });
            });
        }

        return $query->paginate($request->integer('per_page', 20));
    }

    /**
     * Full submission detail — loads all relations for the admin view.
     */
    public function show(ServiceSubmission $submission): ServiceSubmission
    {
        return $submission->load([
            'user',
            'serviceType' => fn ($q) => $q->withTrashed()->with(['service' => fn ($q) => $q->withTrashed()]),
            'payment',
            'documents.documentType',
        ]);
    }

    /**
     * Transition submission to a new admin-driven status.
     *
     * @throws DomainException when the transition is not permitted from the current state.
     */
    public function updateStatus(
        ServiceSubmission $submission,
        AdminUpdateSubmissionStatusDTO $dto,
    ): ServiceSubmission {
        match ($dto->status) {
            SubmissionStatus::Completed  => $this->transitionToCompleted($submission),
            SubmissionStatus::Cancelled  => $this->transitionToCancelled($submission),
            default                      => throw new DomainException('submission.invalid_status'),
        };

        return $submission->fresh();
    }

    /**
     * Upload a result file and mark the submission completed.
     * Security: MIME whitelist re-checked in FileStorageService (defence in depth).
     *
     * @throws DomainException when submission is not in Processing state.
     */
    public function uploadResultFile(ServiceSubmission $submission, UploadedFile $file): ServiceSubmission
    {
        if ($submission->status !== SubmissionStatus::Processing) {
            throw new DomainException('submission.not_processing');
        }

        $path = $this->fileStorage->store($file, 'results', ['application/pdf', 'image/jpeg', 'image/png']);

        DB::transaction(function () use ($submission, $path): void {
            $submission->markCompleted($path);
        });

        Log::info('submission.result_uploaded', ['submission_id' => $submission->id]);

        return $submission->fresh();
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function transitionToCompleted(ServiceSubmission $submission): void
    {
        if ($submission->status !== SubmissionStatus::Processing) {
            throw new DomainException('submission.not_processing');
        }

        $submission->complete();
    }

    private function transitionToCancelled(ServiceSubmission $submission): void
    {
        if (! in_array($submission->status, [
            SubmissionStatus::PendingPayment,
            SubmissionStatus::Processing,
        ], true)) {
            throw new DomainException('submission.not_cancellable');
        }

        $submission->cancel();
    }
}
