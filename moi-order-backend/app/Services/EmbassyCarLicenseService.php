<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateEmbassyCarLicenseDTO;
use App\Enums\DocumentType;
use App\Enums\SubmissionStatus;
use App\Models\EmbassyCarLicenseDetail;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\SubmissionDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for embassy car license submissions only.
 * Principle: DIP — depends on FileStorageInterface; never calls Storage::disk() directly.
 * Principle: Security — idempotency check prevents duplicate submissions on retry.
 *   Passport, visa, identity cards: images only.
 *   TM30: images + PDF — digital TM30s are commonly issued as PDF.
 */
class EmbassyCarLicenseService
{
    /** Images only — identity documents must be photographs. */
    private const IMAGE_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    /** Images + PDF — TM30 may be a scanned image or a digitally-issued PDF. */
    private const IMAGE_AND_PDF_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
    ];

    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /**
     * Create a new embassy car license submission.
     * Idempotent: returns the existing submission if the key was already used by this user.
     */
    public function create(CreateEmbassyCarLicenseDTO $dto): ServiceSubmission
    {
        $existing = ServiceSubmission::with(['serviceType.service', 'embassyCarLicenseDetail', 'documents'])
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

            EmbassyCarLicenseDetail::create([
                'submission_id' => $submission->id,
                'full_name'     => $dto->fullName,
                'phone'         => $dto->phone,
            ]);

            $this->storeDocument($submission->id, DocumentType::PassportBioPage,   $dto->passportBioPage,   self::IMAGE_MIMES);
            $this->storeDocument($submission->id, DocumentType::VisaPage,           $dto->visaPage,           self::IMAGE_MIMES);
            $this->storeDocument($submission->id, DocumentType::IdentityCardFront,  $dto->identityCardFront,  self::IMAGE_MIMES);
            $this->storeDocument($submission->id, DocumentType::IdentityCardBack,   $dto->identityCardBack,   self::IMAGE_MIMES);
            $this->storeDocument($submission->id, DocumentType::Tm30,               $dto->tm30,               self::IMAGE_AND_PDF_MIMES);

            return $submission->load(['serviceType.service', 'embassyCarLicenseDetail', 'documents']);
        });
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    /**
     * @param  array<string>  $allowedMimes  Per-document MIME whitelist.
     */
    private function storeDocument(
        int $submissionId,
        DocumentType $type,
        UploadedFile $file,
        array $allowedMimes,
    ): void {
        $path = $this->storage->store($file, 'submissions/documents', $allowedMimes);

        SubmissionDocument::create([
            'submission_id' => $submissionId,
            'document_type' => $type,
            'file_path'     => $path,
        ]);
    }
}
