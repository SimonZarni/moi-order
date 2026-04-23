<?php

declare(strict_types=1);

namespace App\DTOs;

/**
 * Principle: SRP — immutable value object for a single Excel import row.
 * Principle: DTO — primitives only, no business logic.
 */
readonly class PlaceImportRowDTO
{
    public function __construct(
        public string  $categoryNameMy,
        public string  $categoryNameEn,
        public string  $categoryNameTh,
        public string  $nameMy,
        public string  $nameEn,
        public string  $nameTh,
        public string  $shortDescription,
        public string  $longDescription,
        public string  $address,
        public string  $city,
        public ?float  $latitude,
        public ?float  $longitude,
        public ?string $openingHours,
        public ?string $contactPhone,
        public ?string $website,
        public ?string $googleMapUrl,
        /** @var string[] */
        public array   $tags,
    ) {}

    /**
     * Build from a heading-row-normalised array (keys are lowercased snake_case).
     * Expected headers: category_name_my, category_name_en, category_name_th,
     * name_my, name_en, name_th, short_description, long_description, address,
     * city, latitude, longitude, opening_hours, contact_phone, website,
     * google_map_url, tags
     */
    public static function fromRow(array $row): self
    {
        $str = static fn (mixed $v): string => trim((string) ($v ?? ''));
        $opt = static fn (mixed $v): ?string => ($s = trim((string) ($v ?? ''))) !== '' ? $s : null;

        $rawTags = $str($row['tags'] ?? '');
        $tags    = $rawTags !== ''
            ? array_values(array_filter(array_map('trim', explode(',', $rawTags))))
            : [];

        $lat = $opt($row['latitude'] ?? null);
        $lng = $opt($row['longitude'] ?? null);

        $catEn = $str($row['category_name_en'] ?? '');
        $catMy = $str($row['category_name_my'] ?? '') ?: $catEn;
        $catTh = $str($row['category_name_th'] ?? '') ?: $catEn;

        return new self(
            categoryNameMy:   $catMy,
            categoryNameEn:   $catEn,
            categoryNameTh:   $catTh,
            nameMy:           $str($row['name_my'] ?? ''),
            nameEn:           $str($row['name_en'] ?? ''),
            nameTh:           $str($row['name_th'] ?? ''),
            shortDescription: $str($row['short_description'] ?? ''),
            longDescription:  $str($row['long_description'] ?? ''),
            address:          $str($row['address'] ?? ''),
            city:             $str($row['city'] ?? ''),
            latitude:         $lat !== null && is_numeric($lat) ? (float) $lat : null,
            longitude:        $lng !== null && is_numeric($lng) ? (float) $lng : null,
            openingHours:     $opt($row['opening_hours'] ?? null),
            contactPhone:     $opt($row['contact_phone'] ?? null),
            website:          $opt($row['website'] ?? null),
            googleMapUrl:     $opt($row['google_map_url'] ?? null),
            tags:             $tags,
        );
    }
}
