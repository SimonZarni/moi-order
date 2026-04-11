<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateAirportFastTrackDTO;
use App\Enums\DocumentType;
use App\Enums\SubmissionStatus;
use App\Models\AirportFastTrackDetail;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\SubmissionDocument;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for airport fast track submissions only.
 * Principle: DIP — depends on FileStorageInterface; never calls Storage::disk() directly.
 * Principle: Security — idempotency check prevents duplicate submissions on retry.
 *   price_snapshot captured from live ServiceType at transaction time.
 *   Each document declares its own MIME whitelist — the service controls what it accepts,
 *   not the shared FileStorageService default.
 */
class AirportFastTrackService
{
    /** Images only — upper body photo must be a photograph, never a PDF. */
    private const IMAGE_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    /** Images + PDF — airplane ticket may be a scanned image or a PDF document. */
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
     * Create a new airport fast track submission.
     * Idempotent: returns the existing submission if the key was already used by this user.
     */
    public function create(CreateAirportFastTrackDTO $dto): ServiceSubmission
    {
        $existing = ServiceSubmission::with(['serviceType.service', 'airportFastTrackDetail', 'documents'])
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

            AirportFastTrackDetail::create([
                'submission_id' => $submission->id,
                'full_name'     => $dto->fullName,
                'phone'         => $dto->phone,
            ]);

            // Each call declares the MIME list appropriate for that document type.
            $this->storeDocument(
                $submission->id,
                DocumentType::UpperBodyPhoto,
                $dto->upperBodyPhoto,
                self::IMAGE_MIMES,
            );

            $this->storeDocument(
                $submission->id,
                DocumentType::AirplaneTicket,
                $dto->airplaneTicket,
                self::IMAGE_AND_PDF_MIMES,
            );

            return $submission->load(['serviceType.service', 'airportFastTrackDetail', 'documents']);
        });
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    /**
     * @param  array<string>  $allowedMimes  Per-document MIME whitelist passed to the storage adapter.
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
