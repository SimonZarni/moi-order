<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\HomeCardRouteType;
use App\Http\Requests\Admin\StoreHomeCardRouteRequest;

readonly class StoreHomeCardRouteDTO
{
    public function __construct(
        public string            $key,
        public string            $labelEn,
        public string            $labelMm,
        public HomeCardRouteType $type,
        public ?string           $url,
    ) {}

    public static function fromRequest(StoreHomeCardRouteRequest $request): self
    {
        return new self(
            key:     $request->string('key')->toString(),
            labelEn: $request->string('label_en')->toString(),
            labelMm: $request->string('label_mm')->toString(),
            type:    HomeCardRouteType::from($request->string('type')->toString()),
            url:     $request->input('url'),
        );
    }
}
