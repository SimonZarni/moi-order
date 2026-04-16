<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\AdminUpdatePlaceRequest;

readonly class AdminUpdatePlaceDTO
{
    public function __construct(
        public ?int    $categoryId,
        public ?string $nameMy,
        public ?string $nameEn,
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
        public ?array  $tagIds,
    ) {}

    public static function fromRequest(AdminUpdatePlaceRequest $request): self
    {
        return new self(
            categoryId:       $request->has('category_id')  ? $request->integer('category_id')            : null,
            nameMy:           $request->has('name_my')      ? $request->string('name_my')->toString()      : null,
            nameEn:           $request->has('name_en')      ? $request->string('name_en')->toString()      : null,
            nameTh:           $request->has('name_th')      ? $request->input('name_th')                   : null,
            shortDescription: $request->has('short_description') ? $request->input('short_description')   : null,
            longDescription:  $request->has('long_description')  ? $request->input('long_description')    : null,
            address:          $request->has('address')      ? $request->input('address')                   : null,
            city:             $request->has('city')         ? $request->input('city')                      : null,
            latitude:         $request->has('latitude')     ? ($request->input('latitude') !== null ? (float) $request->input('latitude') : null) : null,
            longitude:        $request->has('longitude')    ? ($request->input('longitude') !== null ? (float) $request->input('longitude') : null) : null,
            openingHours:     $request->has('opening_hours')  ? $request->input('opening_hours')          : null,
            contactPhone:     $request->has('contact_phone')  ? $request->input('contact_phone')          : null,
            website:          $request->has('website')      ? $request->input('website')                   : null,
            googleMapUrl:     $request->has('google_map_url') ? $request->input('google_map_url')         : null,
            tagIds:           $request->has('tag_ids')      ? $request->input('tag_ids', [])               : null,
        );
    }
}
