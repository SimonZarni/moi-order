<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\CreateTestServiceDTO;
use App\Enums\SubmissionStatus;
use App\Models\ServiceSubmission;
use App\Models\ServiceType;
use App\Models\TestServiceDetail;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns all business logic for test service submissions only.
 * Security: idempotency check prevents duplicate submissions on retry.
 *   price_snapshot captured from live ServiceType at transaction time.
 * NOTE: file upload temporarily removed for debugging submission flow.
 */
class TestService
{
    public function __construct() {}

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

            return $submission->load(['serviceType.service', 'testServiceDetail', 'documents']);
        });
    }
}
