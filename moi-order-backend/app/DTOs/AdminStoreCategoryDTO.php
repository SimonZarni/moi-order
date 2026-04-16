<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminStoreCategoryRequest;

readonly class AdminStoreCategoryDTO
{
    public function __construct(
        public string  $nameMy,
        public string  $nameEn,
        public ?string $nameTh,
        public string  $slug,
    ) {}

    public static function fromRequest(AdminStoreCategoryRequest $request): self
    {
        return new self(
            nameMy: $request->string('name_my')->toString(),
            nameEn: $request->string('name_en')->toString(),
            nameTh: $request->input('name_th'),
            slug:   $request->string('slug')->toString(),
        );
    }
}
