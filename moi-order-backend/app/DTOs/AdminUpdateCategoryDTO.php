<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminUpdateCategoryRequest;

readonly class AdminUpdateCategoryDTO
{
    public function __construct(
        public ?string $nameMy,
        public ?string $nameEn,
        public ?string $nameTh,
        public ?string $slug,
    ) {}

    public static function fromRequest(AdminUpdateCategoryRequest $request): self
    {
        return new self(
            nameMy: $request->has('name_my') ? $request->string('name_my')->toString() : null,
            nameEn: $request->has('name_en') ? $request->string('name_en')->toString() : null,
            nameTh: $request->has('name_th') ? $request->input('name_th')              : null,
            slug:   $request->has('slug')    ? $request->string('slug')->toString()    : null,
        );
    }
}
