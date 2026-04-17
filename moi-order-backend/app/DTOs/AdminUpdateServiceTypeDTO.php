<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminUpdateServiceTypeRequest;

readonly class AdminUpdateServiceTypeDTO
{
    public function __construct(
        public ?string $name,
        public ?string $nameEn,
        public ?int    $price,
        public ?bool   $isActive,
        public ?array  $fieldSchema,
    ) {}

    public static function fromRequest(AdminUpdateServiceTypeRequest $request): self
    {
        return new self(
            name:        $request->has('name')         ? $request->string('name')->toString()    : null,
            nameEn:      $request->has('name_en')      ? $request->string('name_en')->toString() : null,
            price:       $request->has('price')        ? $request->integer('price')              : null,
            isActive:    $request->has('is_active')    ? $request->boolean('is_active')          : null,
            fieldSchema: $request->has('field_schema') ? $request->input('field_schema')         : null,
        );
    }
}
