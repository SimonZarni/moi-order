<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\SubmissionStatus;
use App\Http\Requests\Admin\AdminUpdateSubmissionStatusRequest;

readonly class AdminUpdateSubmissionStatusDTO
{
    public function __construct(
        public SubmissionStatus $status,
    ) {}

    public static function fromRequest(AdminUpdateSubmissionStatusRequest $request): self
    {
        return new self(
            status: SubmissionStatus::from($request->string('status')->toString()),
        );
    }
}
