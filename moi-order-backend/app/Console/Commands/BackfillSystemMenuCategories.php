<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Restaurant;
use App\Services\MenuService;
use Illuminate\Console\Command;

/**
 * Principle: SRP — one-off backfill for restaurants created before system
 * categories (Popular Picks, Promotions, Recommendations) were auto-seeded.
 * Safe to re-run: MenuService::createSystemCategoriesForRestaurant() is idempotent.
 */
class BackfillSystemMenuCategories extends Command
{
    protected $signature = 'restaurants:backfill-system-categories';

    protected $description = 'Ensure every restaurant has the 3 system menu categories (Popular Picks, Promotions, Recommendations)';

    public function handle(MenuService $menuService): int
    {
        $count = 0;

        Restaurant::withTrashed()->chunkById(100, function ($restaurants) use ($menuService, &$count): void {
            foreach ($restaurants as $restaurant) {
                $menuService->createSystemCategoriesForRestaurant($restaurant);
                $count++;
            }
        });

        $this->info("Checked {$count} restaurant(s) for system menu categories.");

        return self::SUCCESS;
    }
}
