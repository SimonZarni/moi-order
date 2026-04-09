<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateCompanyRegistrationDTO;
use App\Enums\DocumentType;
use App\Enums\SubmissionStatus;
use App\Models\CompanyRegistrationDetail;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\SubmissionDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for company registration submissions only.
 * Principle: DIP — depends on FileStorageInterface; never calls Storage::disk() directly.
 * Principle: Security — idempotency check prevents duplicate submissions on retry.
 *   price_snapshot captured from live ServiceType at transaction time.
 */
class CompanyRegistrationService
{
    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /**
     * Create a new company registration submission.
     * Idempotent: returns the existing submission if the key was already used by this user.
     */
    public function create(CreateCompanyRegistrationDTO $dto): ServiceSubmission
    {
        $existing = ServiceSubmission::with(['serviceType.service', 'companyRegistrationDetail', 'documents'])
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
                'price_snapshot'  => $serviceType->price,
                'status'          => SubmissionStatus::Processing,
                'idempotency_key' => $dto->idempotencyKey,
            ]);

            CompanyRegistrationDetail::create([
                'submission_id' => $submission->id,
                'full_name'     => $dto->fullName,
                'phone'         => $dto->phone,
            ]);

            $this->storeDocument($submission->id, DocumentType::PassportBioPage,   $dto->passportBioPage);
            $this->storeDocument($submission->id, DocumentType::VisaPage,           $dto->visaPage);
            $this->storeDocument($submission->id, DocumentType::IdentityCardFront,  $dto->identityCardFront);
            $this->storeDocument($submission->id, DocumentType::IdentityCardBack,   $dto->identityCardBack);
            $this->storeDocument($submission->id, DocumentType::Tm30,               $dto->tm30);

            return $submission->load(['serviceType.service', 'companyRegistrationDetail', 'documents']);
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
