<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateTestServiceDTO;
use App\Enums\DocumentType;
use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\SubmissionDocument;
use App\Models\TestServiceDetail;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for test service submissions only.
 * Principle: DIP — depends on FileStorageInterface; never calls Storage::disk() directly.
 * Security: idempotency check prevents duplicate submissions on retry.
 *   price_snapshot captured from live ServiceType at transaction time.
 */
class TestService
{
    private const IMAGE_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    public function create(CreateTestServiceDTO $dto): ServiceSubmission
    {
        $existing = ServiceSubmission::with(['serviceType.service', 'testServiceDetail', 'documents'])
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
                'status'          => SubmissionStatus::PendingPayment,
                'idempotency_key' => $dto->idempotencyKey,
            ]);

            TestServiceDetail::create([
                'submission_id' => $submission->id,
                'full_name'     => $dto->fullName,
                'phone'         => $dto->phone,
            ]);

            $this->storeDocument($submission->id, $dto->photo);

            return $submission->load(['serviceType.service', 'testServiceDetail', 'documents']);
        });
    }

    private function storeDocument(int $submissionId, UploadedFile $file): void
    {
        $path = $this->storage->store($file, 'submissions/documents', self::IMAGE_MIMES);

        SubmissionDocument::create([
            'submission_id' => $submissionId,
            'document_type' => DocumentType::TestPhoto,
            'file_path'     => $path,
        ]);
    }
}
