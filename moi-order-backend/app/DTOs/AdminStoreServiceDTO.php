<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminStoreServiceRequest;

readonly class AdminStoreServiceDTO
{
    public function __construct(
        public string $name,
        public string $nameEn,
        public string $slug,
        public bool   $isActive,
    ) {}

    public static function fromRequest(AdminStoreServiceRequest $request): self
    {
        return new self(
            name:     $request->string('name')->toString(),
            nameEn:   $request->string('name_en')->toString(),
            slug:     $request->string('slug')->toString(),
            isActive: $request->boolean('is_active'),
        );
    }
}
