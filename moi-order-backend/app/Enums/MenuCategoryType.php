<?php

declare(strict_types=1);

namespace App\Enums;

enum MenuCategoryType: string
{
    case PopularPicks    = 'popular_picks';
    case Promotions      = 'promotions';
    case Recommendations = 'recommendations';

    public function label(): string
    {
        return match($this) {
            self::PopularPicks    => 'Popular Picks',
            self::Promotions      => 'Promotions',
            self::Recommendations => 'Recommendations',
        };
    }

    /** Required categories must have at least one item before restaurant can open. */
    public function isRequired(): bool
    {
        return match($this) {
            self::PopularPicks, self::Recommendations => true,
            self::Promotions                          => false,
        };
    }

    /** Canonical display order for system categories (lower = first). */
    public function sortOrder(): int
    {
        return match($this) {
            self::PopularPicks    => 0,
            self::Promotions      => 1,
            self::Recommendations => 2,
        };
    }
}
