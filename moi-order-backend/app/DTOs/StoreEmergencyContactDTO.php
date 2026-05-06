<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Enums\EmergencyContactType;
use App\Http\Requests\Admin\AdminStoreEmergencyContactRequest;

readonly class StoreEmergencyContactDTO
{
    public function __construct(
        public EmergencyContactType $type,
        public string               $titleEn,
        public string               $titleMm,
        public ?string              $titleTh,
        public ?string              $descriptionEn,
        public ?string              $descriptionMm,
        public ?string              $descriptionTh,
        public ?string              $phone,
        public ?string              $mapUrl,
        public ?float               $latitude,
        public ?float               $longitude,
        public ?string              $location,
        public ?string              $facebookUrl,
        public ?string              $websiteUrl,
        public bool                 $isActive,
    ) {}

    public static function fromRequest(AdminStoreEmergencyContactRequest $request): self
    {
        return new self(
            type:          EmergencyContactType::from($request->string('type')->value()),
            titleEn:       $request->string('title_en')->trim()->value(),
            titleMm:       $request->string('title_mm')->trim()->value(),
            titleTh:       $request->string('title_th')->trim()->value() ?: null,
            descriptionEn: $request->string('description_en')->trim()->value() ?: null,
            descriptionMm: $request->string('description_mm')->trim()->value() ?: null,
            descriptionTh: $request->string('description_th')->trim()->value() ?: null,
            phone:         $request->string('phone')->trim()->value() ?: null,
            mapUrl:        $request->string('map_url')->trim()->value() ?: null,
            latitude:      $request->input('latitude') !== null ? (float) $request->input('latitude') : null,
            longitude:     $request->input('longitude') !== null ? (float) $request->input('longitude') : null,
            location:      $request->string('location')->trim()->value() ?: null,
            facebookUrl:   $request->string('facebook_url')->trim()->value() ?: null,
            websiteUrl:    $request->string('website_url')->trim()->value() ?: null,
            isActive:      (bool) $request->boolean('is_active', true),
        );
    }
}
