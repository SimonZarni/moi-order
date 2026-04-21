<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminUpdateDocumentTypeRequest;

readonly class AdminUpdateDocumentTypeDTO
{
    public function __construct(
        public string  $nameEn,
        public ?string $nameMm,
        public bool    $isActive,
    ) {}

    public static function fromRequest(AdminUpdateDocumentTypeRequest $request): self
    {
        return new self(
            nameEn:   $request->string('name_en')->toString(),
            nameMm:   $request->input('name_mm'),
            isActive: $request->boolean('is_active'),
        );
    }
}
