<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\AppAlertFrequency;
use Illuminate\Http\Request;

readonly class InAppAlertDTO
{
    public function __construct(
        public string           $title,
        public string           $message,
        public AppAlertFrequency $frequency,
        public bool             $isActive,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            title:     $request->string('title')->trim()->toString(),
            message:   $request->string('message')->trim()->toString(),
            frequency: AppAlertFrequency::from($request->string('frequency')->toString()),
            isActive:  $request->boolean('is_active', false),
        );
    }
}
