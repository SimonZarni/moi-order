<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\UpdateServiceCategoryRequest;

readonly class AdminUpdateServiceCategoryDTO
{
    public function __construct(
        public string  $name,
        public string  $nameEn,
        public ?string $nameMm,
        public string  $slug,
        public ?string $navigationScreen,
        public bool    $isActive,
    ) {}

    public static function fromRequest(UpdateServiceCategoryRequest $request): self
    {
        return new self(
            name:             $request->string('name')->toString(),
            nameEn:           $request->string('name_en')->toString(),
            nameMm:           $request->filled('name_mm') ? $request->string('name_mm')->toString() : null,
            slug:             $request->string('slug')->toString(),
            navigationScreen: $request->filled('navigation_screen') ? $request->string('navigation_screen')->toString() : null,
            isActive:         $request->boolean('is_active'),
        );
    }
}
