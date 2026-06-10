<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\MenuCategoryType;
use App\Enums\MenuItemStatus;
use App\Models\Restaurant;
use App\Services\MenuService;
use Illuminate\Console\Command;

/**
 * SRP — enforces the 3-system-category rule across all restaurants.
 * Safe to re-run: idempotent backfill + only closes restaurants that are non-compliant.
 */
class EnforceMenuRules extends Command
{
    protected $signature = 'restaurants:enforce-menu-rules
                            {--dry-run : Report violations without making changes}';

    protected $description = 'Backfill system categories and close restaurants that violate required-category rules';

    public function handle(MenuService $menuService): int
    {
        $dryRun      = (bool) $this->option('dry-run');
        $backfilled  = 0;
        $closed      = 0;
        $compliant   = 0;
        $violations  = [];

        Restaurant::with(['menuCategories.menuItems'])
            ->chunkById(100, function ($restaurants) use (
                $menuService, $dryRun, &$backfilled, &$closed, &$compliant, &$violations,
            ): void {
                foreach ($restaurants as $restaurant) {
                    if (! $dryRun) {
                        $menuService->createSystemCategoriesForRestaurant($restaurant);
                        $restaurant->refresh()->load('menuCategories.menuItems');
                        $backfilled++;
                    }

                    $missing = $this->missingRequiredCategories($restaurant);

                    if (! empty($missing)) {
                        $violations[] = "#{$restaurant->id} {$restaurant->name} — missing items in: " . implode(', ', $missing);

                        if (! $dryRun && $restaurant->status->value === 'open') {
                            $restaurant->markAsClosed();
                            $closed++;
                        }
                    } else {
                        $compliant++;
                    }
                }
            });

        if ($dryRun) {
            $this->info('DRY RUN — no changes made.');
        } else {
            $this->info("Backfilled system categories for {$backfilled} restaurant(s).");
            $this->info("Force-closed {$closed} non-compliant open restaurant(s).");
        }

        $this->info("Compliant restaurants: {$compliant}.");

        if (! empty($violations)) {
            $this->warn('Violations found:');
            foreach ($violations as $v) {
                $this->line("  {$v}");
            }
            return self::FAILURE;
        }

        $this->info('All restaurants comply with menu rules.');
        return self::SUCCESS;
    }

    /** @return string[] names of required system categories that have no available items */
    private function missingRequiredCategories(Restaurant $restaurant): array
    {
        $missing = [];

        foreach (MenuCategoryType::cases() as $type) {
            if (! $type->isRequired()) {
                continue;
            }

            $category = $restaurant->menuCategories
                ->first(fn ($c) => $c->category_type === $type);

            $hasItems = $category !== null
                && $category->menuItems->where('status', MenuItemStatus::Available)->isNotEmpty();

            if (! $hasItems) {
                $missing[] = $type->label();
            }
        }

        return $missing;
    }
}
