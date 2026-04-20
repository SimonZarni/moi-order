<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminStoreServiceTypeRequest;

readonly class AdminStoreServiceTypeDTO
{
    public function __construct(
        public string  $name,
        public string  $nameEn,
        public ?string $nameMm,
        public int     $price,
        public bool    $isActive,
        public ?array  $fieldSchema,
    ) {}

    public static function fromRequest(AdminStoreServiceTypeRequest $request): self
    {
        return new self(
            name:        $request->string('name')->toString(),
            nameEn:      $request->string('name_en')->toString(),
            nameMm:      $request->filled('name_mm') ? $request->string('name_mm')->toString() : null,
            price:       $request->integer('price'),
            isActive:    $request->boolean('is_active'),
            fieldSchema: $request->has('field_schema') ? $request->input('field_schema') : null,
        );
    }
}
