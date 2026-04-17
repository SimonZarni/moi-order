<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\StoreDynamicSubmissionRequest;
use Illuminate\Http\UploadedFile;

/**
 * Principle: SRP — plain data carrier for a dynamic submission. No business logic.
 * Principle: DIP — Service receives typed DTO; never sees the Request object.
 * Security: only schema-defined keys are carried — unknown keys never reach the service.
 */
readonly class CreateDynamicSubmissionDTO
{
    /**
     * @param  array<string, scalar>       $fields  Text/select/date/etc values keyed by field key.
     * @param  array<string, UploadedFile> $files   File uploads keyed by field key.
     */
    public function __construct(
        public int    $userId,
        public int    $serviceTypeId,
        public string $idempotencyKey,
        public array  $fields,
        public array  $files,
    ) {}

    public static function fromRequest(StoreDynamicSubmissionRequest $request): self
    {
        return new self(
            userId:          $request->user()->id,
            serviceTypeId:   $request->integer('service_type_id'),
            idempotencyKey:  $request->string('idempotency_key')->toString(),
            fields:          $request->input('fields', []),
            files:           $request->allFiles()['files'] ?? [],
        );
    }
}
