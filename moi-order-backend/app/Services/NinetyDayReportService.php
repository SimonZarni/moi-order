<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateNinetyDayReportDTO;
use App\Enums\DocumentType;
use App\Enums\SubmissionStatus;
use App\Models\NinetyDayReportDetail;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\SubmissionDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for 90-day report submissions only.
 * Principle: DIP — depends on FileStorageInterface; never calls Storage::disk() directly.
 * Principle: Security — idempotency check prevents duplicate submissions on retry.
 *   price_snapshot captured from live ServiceType at transaction time.
 *   Files uploaded inside the transaction scope to keep DB + storage consistent.
 */
class NinetyDayReportService
{
    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /**
     * Create a new 90-day report submission.
     * Idempotent: returns the existing submission if the key was already used by this user.
     */
    public function create(CreateNinetyDayReportDTO $dto): ServiceSubmission
    {
        // Idempotency: return existing submission without re-creating.
        $existing = ServiceSubmission::with(['serviceType.service', 'ninetyDayReportDetail', 'documents'])
            ->forUser($dto->userId)
            ->where('idempotency_key', $dto->idempotencyKey)
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        $serviceType = ServiceType::findOrFail($dto->serviceTypeId);

        return DB::transaction(function () use ($dto, $serviceType): ServiceSubmission {
            $submission = ServiceSubmission::create([
                'user_id'         => $dto->userId,
                'service_type_id' => $serviceType->id,
                'price_snapshot'  => $serviceType->price, // snapshot — immutable from here on
                'status'          => SubmissionStatus::Processing,
                'idempotency_key' => $dto->idempotencyKey,
            ]);

            NinetyDayReportDetail::create([
                'submission_id' => $submission->id,
                'full_name'     => $dto->fullName,
                'phone'         => $dto->phone,
            ]);

            // Upload all three documents and record references.
            $this->storeDocument($submission->id, DocumentType::PassportBioPage, $dto->passportBioPage);
            $this->storeDocument($submission->id, DocumentType::VisaPage, $dto->visaPage);
            $this->storeDocument($submission->id, DocumentType::OldSlip, $dto->oldSlip);

            return $submission->load(['serviceType.service', 'ninetyDayReportDetail', 'documents']);
        });
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function storeDocument(int $submissionId, DocumentType $type, UploadedFile $file): void
    {
        $path = $this->storage->store($file, 'submissions/documents');

        SubmissionDocument::create([
            'submission_id' => $submissionId,
            'document_type' => $type,
            'file_path'     => $path,
        ]);
    }
}
