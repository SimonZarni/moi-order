<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateEmbassyVisaRecommendationDTO;
use App\Enums\DocumentType;
use App\Enums\SubmissionStatus;
use App\Models\EmbassyVisaRecommendationDetail;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\SubmissionDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for embassy visa recommendation submissions only.
 * Principle: DIP — depends on FileStorageInterface; never calls Storage::disk() directly.
 * Principle: Security — idempotency check prevents duplicate submissions on retry.
 *   All documents are identity photographs — images only (no PDF accepted).
 */
class EmbassyVisaRecommendationService
{
    /** Images only — all four documents must be photographs. */
    private const IMAGE_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /**
     * Create a new embassy visa recommendation submission.
     * Idempotent: returns the existing submission if the key was already used by this user.
     */
    public function create(CreateEmbassyVisaRecommendationDTO $dto): ServiceSubmission
    {
        $existing = ServiceSubmission::with(['serviceType.service', 'embassyVisaRecommendationDetail', 'documents'])
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

            EmbassyVisaRecommendationDetail::create([
                'submission_id' => $submission->id,
                'full_name'     => $dto->fullName,
                'phone'         => $dto->phone,
            ]);

            $this->storeDocument($submission->id, DocumentType::PassportBioPage,  $dto->passportBioPage);
            $this->storeDocument($submission->id, DocumentType::VisaPage,         $dto->visaPage);
            $this->storeDocument($submission->id, DocumentType::IdentityCardFront, $dto->identityCardFront);
            $this->storeDocument($submission->id, DocumentType::IdentityCardBack,  $dto->identityCardBack);

            return $submission->load(['serviceType.service', 'embassyVisaRecommendationDetail', 'documents']);
        });
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function storeDocument(
        int $submissionId,
        DocumentType $type,
        UploadedFile $file,
    ): void {
        $path = $this->storage->store($file, 'submissions/documents', self::IMAGE_MIMES);

        SubmissionDocument::create([
            'submission_id' => $submissionId,
            'document_type' => $type,
            'file_path'     => $path,
        ]);
    }
}
