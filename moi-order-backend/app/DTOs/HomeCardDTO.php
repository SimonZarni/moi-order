<?php

declare(strict_types=1);

namespace App\DTOs;

use App\Http\Requests\Admin\StoreHomeCardRequest;
use App\Http\Requests\Admin\UpdateHomeCardRequest;

readonly class HomeCardDTO
{
    public function __construct(
        public string  $slug,
        public string  $titleEn,
        public string  $titleMm,
        public ?string $subtitleEn,
        public ?string $subtitleMm,
        public string  $tagEn,
        public string  $tagMm,
        public string  $accentColor,
        public string  $borderColor,
        public string  $iconColor,
        public string  $iconKey,
        public ?string $navigationScreen,
        public ?array  $navigationParams,
        public bool    $isActive,
        public bool    $isComingSoon,
        public ?int    $parentId,
    ) {}

    public static function fromStoreRequest(StoreHomeCardRequest $request): self
    {
        return new self(
            slug:             $request->string('slug')->toString(),
            titleEn:          $request->string('title_en')->toString(),
            titleMm:          $request->string('title_mm')->toString(),
            subtitleEn:       $request->input('subtitle_en'),
            subtitleMm:       $request->input('subtitle_mm'),
            tagEn:            $request->string('tag_en')->toString(),
            tagMm:            $request->string('tag_mm')->toString(),
            accentColor:      $request->string('accent_color')->toString(),
            borderColor:      $request->string('border_color')->toString(),
            iconColor:        $request->string('icon_color')->toString(),
            iconKey:          $request->string('icon_key')->toString(),
            navigationScreen: $request->input('navigation_screen'),
            navigationParams: $request->input('navigation_params'),
            isActive:         $request->boolean('is_active'),
            isComingSoon:     $request->boolean('is_coming_soon'),
            parentId:         $request->integer('parent_id') ?: null,
        );
    }

    public static function fromUpdateRequest(UpdateHomeCardRequest $request): self
    {
        return new self(
            slug:             $request->string('slug')->toString(),
            titleEn:          $request->string('title_en')->toString(),
            titleMm:          $request->string('title_mm')->toString(),
            subtitleEn:       $request->input('subtitle_en'),
            subtitleMm:       $request->input('subtitle_mm'),
            tagEn:            $request->string('tag_en')->toString(),
            tagMm:            $request->string('tag_mm')->toString(),
            accentColor:      $request->string('accent_color')->toString(),
            borderColor:      $request->string('border_color')->toString(),
            iconColor:        $request->string('icon_color')->toString(),
            iconKey:          $request->string('icon_key')->toString(),
            navigationScreen: $request->input('navigation_screen'),
            navigationParams: $request->input('navigation_params'),
            isActive:         $request->boolean('is_active'),
            isComingSoon:     $request->boolean('is_coming_soon'),
            parentId:         $request->integer('parent_id') ?: null,
        );
    }
}
