<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\RemoveEmailRequest;

readonly class RemoveEmailDTO
{
    public function __construct(
        public string $otp,
    ) {}

    public static function fromRequest(RemoveEmailRequest $request): self
    {
        return new self(
            otp: $request->string('otp')->toString(),
        );
    }
}
