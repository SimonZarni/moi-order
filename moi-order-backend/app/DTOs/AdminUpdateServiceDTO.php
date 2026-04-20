<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminUpdateServiceRequest;

readonly class AdminUpdateServiceDTO
{
    public function __construct(
        public ?string $name,
        public ?string $nameEn,
        public ?string $nameMm,
        public ?string $slug,
        public ?bool   $isActive,
    ) {}

    public static function fromRequest(AdminUpdateServiceRequest $request): self
    {
        return new self(
            name:     $request->has('name')      ? $request->string('name')->toString()    : null,
            nameEn:   $request->has('name_en')   ? $request->string('name_en')->toString() : null,
            nameMm:   $request->has('name_mm')   ? $request->input('name_mm')              : null,
            slug:     $request->has('slug')      ? $request->string('slug')->toString()    : null,
            isActive: $request->has('is_active') ? $request->boolean('is_active')          : null,
        );
    }
}
