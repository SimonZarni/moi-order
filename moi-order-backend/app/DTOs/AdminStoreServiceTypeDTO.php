<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminStoreServiceTypeRequest;

readonly class AdminStoreServiceTypeDTO
{
    public function __construct(
        public string $name,
        public string $nameEn,
        public int    $price,
        public bool   $isActive,
    ) {}

    public static function fromRequest(AdminStoreServiceTypeRequest $request): self
    {
        return new self(
            name:     $request->string('name')->toString(),
            nameEn:   $request->string('name_en')->toString(),
            price:    $request->integer('price'),
            isActive: $request->boolean('is_active'),
        );
    }
}
