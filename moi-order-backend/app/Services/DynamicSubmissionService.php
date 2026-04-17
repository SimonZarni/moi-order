<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\DTOs\CreateDynamicSubmissionDTO;
use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for dynamic-schema submissions only.
 * Principle: DIP — depends on FileStorageInterface; never calls Storage::disk() directly.
 * Security: idempotency check prevents duplicate submissions on retry.
 *   price_snapshot captured from live ServiceType at transaction time.
 *   File paths stored under _files key — never exposed raw; signed URLs generated in Resource.
 *   submission_data keys are restricted to schema-defined keys only (DTO strips unknowns).
 */
class DynamicSubmissionService
{
    /** @see FieldType — mirrors the accepts values defined on file-type schema fields. */
    private const MIME_MAP = [
        'image' => ['image/jpeg', 'image/png', 'image/webp'],
        'pdf'   => ['application/pdf'],
        'doc'   => [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
    ];

    public function __construct(
        private readonly FileStorageInterface $storage,
    ) {}

    /**
     * Create a new dynamic submission.
     * Idempotent: returns the existing submission if the key was already used by this user.
     */
    public function create(CreateDynamicSubmissionDTO $dto): ServiceSubmission
    {
        $existing = ServiceSubmission::with(['serviceType.service'])
            ->forUser($dto->userId)
            ->where('idempotency_key', $dto->idempotencyKey)
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        $serviceType = ServiceType::findOrFail($dto->serviceTypeId);

        return DB::transaction(function () use ($dto, $serviceType): ServiceSubmission {
            // Build submission_data: text values first, file paths nested under _files.
            $submissionData         = $dto->fields;
            $submissionData['_files'] = [];

            foreach ($dto->files as $key => $file) {
                $fieldDef     = collect($serviceType->field_schema)->firstWhere('key', $key);
                $accepts      = $fieldDef['accepts'] ?? ['image'];
                $allowedMimes = $this->resolveMimes($accepts);

                $submissionData['_files'][$key] = $this->storage->store(
                    $file,
                    'submissions/documents',
                    $allowedMimes,
                );
            }

            $submission = ServiceSubmission::create([
                'user_id'          => $dto->userId,
                'service_type_id'  => $serviceType->id,
                'price_snapshot'   => $serviceType->price,
                'status'           => SubmissionStatus::PendingPayment,
                'idempotency_key'  => $dto->idempotencyKey,
                'submission_data'  => $submissionData,
            ]);

            return $submission->load(['serviceType.service']);
        });
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    /** @param  array<string>  $accepts  e.g. ['image', 'pdf'] */
    private function resolveMimes(array $accepts): array
    {
        return array_merge(...array_map(
            fn (string $a) => self::MIME_MAP[$a] ?? [],
            $accepts,
        ));
    }
}
