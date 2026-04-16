<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminStorePlaceRequest;

readonly class AdminStorePlaceDTO
{
    public function __construct(
        public int     $categoryId,
        public string  $nameMy,
        public string  $nameEn,
        public ?string $nameTh,
        public ?string $shortDescription,
        public ?string $longDescription,
        public ?string $address,
        public ?string $city,
        public ?float  $latitude,
        public ?float  $longitude,
        public ?string $openingHours,
        public ?string $contactPhone,
        public ?string $website,
        public ?string $googleMapUrl,
        public array   $tagIds,
    ) {}

    public static function fromRequest(AdminStorePlaceRequest $request): self
    {
        return new self(
            categoryId:       $request->integer('category_id'),
            nameMy:           $request->string('name_my')->toString(),
            nameEn:           $request->string('name_en')->toString(),
            nameTh:           $request->input('name_th'),
            shortDescription: $request->input('short_description'),
            longDescription:  $request->input('long_description'),
            address:          $request->input('address'),
            city:             $request->input('city'),
            latitude:         $request->filled('latitude') ? (float) $request->input('latitude') : null,
            longitude:        $request->filled('longitude') ? (float) $request->input('longitude') : null,
            openingHours:     $request->input('opening_hours'),
            contactPhone:     $request->input('contact_phone'),
            website:          $request->input('website'),
            googleMapUrl:     $request->input('google_map_url'),
            tagIds:           $request->input('tag_ids', []),
        );
    }
}
