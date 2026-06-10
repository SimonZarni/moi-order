<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\MenuCategoryType;
use App\Models\MenuCategory;
use App\Models\Restaurant;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MigrateItemsToSystemCategories extends Command
{
    protected $signature = 'restaurants:migrate-items-to-system-categories
                            {--dry-run : Show what would be moved without making changes}';

    protected $description = 'Move menu items from old non-system categories into the matching system categories, then remove the old ones';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $moved  = 0;

        Restaurant::chunkById(100, function ($restaurants) use ($dryRun, &$moved): void {
            foreach ($restaurants as $restaurant) {
                foreach (MenuCategoryType::cases() as $type) {
                    $system = MenuCategory::where('restaurant_id', $restaurant->id)
                        ->where('category_type', $type->value)
                        ->first();

                    if ($system === null) {
                        continue;
                    }

                    // Match non-system categories by name — case-insensitive, singular or plural
                    // e.g. "Recommendation" and "Recommendations" both match MenuCategoryType::Recommendations
                    $prefix = strtolower(rtrim($type->label(), 's'));
                    $old = MenuCategory::where('restaurant_id', $restaurant->id)
                        ->whereNull('category_type')
                        ->whereRaw('LOWER(name) LIKE ?', [$prefix . '%'])
                        ->get();

                    foreach ($old as $oldCat) {
                        $itemCount = $oldCat->menuItems()->count();
                        $this->line(
                            "Restaurant #{$restaurant->id} ({$restaurant->name}): " .
                            "move {$itemCount} item(s) from old #{$oldCat->id} → system #{$system->id} ({$type->label()})"
                        );

                        if (! $dryRun) {
                            DB::transaction(function () use ($oldCat, $system): void {
                                DB::table('menu_items')
                                    ->where('menu_category_id', $oldCat->id)
                                    ->update(['menu_category_id' => $system->id]);

                                $oldCat->delete();
                            });
                        }

                        $moved += $itemCount;
                    }
                }
            }
        });

        if ($dryRun) {
            $this->info("DRY RUN — no changes made. Would move {$moved} item(s).");
        } else {
            $this->info("Done. Moved {$moved} item(s) into system categories and removed old duplicates.");
        }

        return self::SUCCESS;
    }
}
