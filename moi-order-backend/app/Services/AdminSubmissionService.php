<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminUpdateSubmissionStatusDTO;
use App\Enums\SubmissionStatus;
use App\Exceptions\DomainException;
use App\Http\Requests\Admin\AdminSubmissionIndexRequest;
use App\Models\ServiceSubmission;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Principle: SRP — owns admin-side submission business logic only.
 *   No user scoping: admin sees all submissions.
 * Principle: Security — status transitions validated here; model domain methods
 *   provide a second guard layer (defence in depth).
 *
 * Status transition rules:
 *   pending_payment → processing  (admin overrides a missed webhook)
 *   processing      → completed   (primary admin workflow)
 *   Any other       → 409 DomainException
 */
class AdminSubmissionService
{
    /**
     * Paginated list with optional filters.
     * Index deliberately excludes heavy detail relations — those are for show() only.
     */
    public function index(AdminSubmissionIndexRequest $request): LengthAwarePaginator
    {
        $query = ServiceSubmission::with(['user', 'serviceType.service', 'payment'])
            ->latest();

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
     * Full submission detail — loads every detail relation for the admin view.
     */
    public function show(ServiceSubmission $submission): ServiceSubmission
    {
        return $submission->load([
            'user',
            'serviceType.service',
            'payment',
            'documents',
            'ninetyDayReportDetail',
            'companyRegistrationDetail',
            'airportFastTrackDetail',
            'embassyResidentialDetail',
            'embassyCarLicenseDetail',
            'embassyBankDetail',
            'embassyVisaRecommendationDetail',
            'testServiceDetail',
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
            SubmissionStatus::Processing => $this->transitionToProcessing($submission),
            SubmissionStatus::Completed  => $this->transitionToCompleted($submission),
            default                      => throw new DomainException('submission.invalid_status'),
        };

        return $submission->fresh();
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function transitionToProcessing(ServiceSubmission $submission): void
    {
        if ($submission->status !== SubmissionStatus::PendingPayment) {
            throw new DomainException('submission.not_pending_payment');
        }

        $submission->markProcessing();
    }

    private function transitionToCompleted(ServiceSubmission $submission): void
    {
        if ($submission->status !== SubmissionStatus::Processing) {
            throw new DomainException('submission.not_processing');
        }

        $submission->complete();
    }
}
