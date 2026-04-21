<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminStoreDocumentTypeRequest;

readonly class AdminStoreDocumentTypeDTO
{
    public function __construct(
        public string  $slug,
        public string  $nameEn,
        public ?string $nameMm,
        public bool    $isActive,
    ) {}

    public static function fromRequest(AdminStoreDocumentTypeRequest $request): self
    {
        return new self(
            slug:     $request->string('slug')->toString(),
            nameEn:   $request->string('name_en')->toString(),
            nameMm:   $request->input('name_mm'),
            isActive: $request->boolean('is_active', true),
        );
    }
}
