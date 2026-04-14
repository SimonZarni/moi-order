<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\StoreTestServiceRequest;
use Illuminate\Http\UploadedFile;

/**
 * Principle: SRP — plain data carrier for one operation; no business logic.
 * Principle: DIP — Controller extracts this from the Request; Service receives only primitives + file.
 * Principle: Immutability — all properties readonly; cannot be mutated after construction.
 */
readonly class CreateTestServiceDTO
{
    public function __construct(
        public int          $userId,
        public int          $serviceTypeId,
        public string       $fullName,
        public string       $phone,
        public string       $idempotencyKey,
        public UploadedFile $photo,
    ) {}

    public static function fromRequest(StoreTestServiceRequest $request): self
    {
        return new self(
            userId:         $request->user()->id,
            serviceTypeId:  $request->integer('service_type_id'),
            fullName:       $request->string('full_name')->toString(),
            phone:          $request->string('phone')->toString(),
            idempotencyKey: $request->string('idempotency_key')->toString(),
            photo:          $request->file('photo'),
        );
    }
}
