<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\MenuCategoryType;
use App\Models\MenuCategory;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class MoveCategoryToSystem extends Command
{
    protected $signature = 'restaurants:move-category-to-system
                            {from_id   : ID of the source category to drain}
                            {to_type   : System category type to move items into (popular_picks|promotions|recommendations)}
                            {--dry-run : Show what would be moved without making changes}';

    protected $description = 'Move all items from an arbitrary category into a system category, then soft-delete the source';

    public function handle(): int
    {
        $fromId  = (int) $this->argument('from_id');
        $toType  = $this->argument('to_type');
        $dryRun  = (bool) $this->option('dry-run');

        $type = MenuCategoryType::tryFrom($toType);
        if ($type === null) {
            $this->error("Invalid to_type '{$toType}'. Valid values: popular_picks, promotions, recommendations");
            return self::FAILURE;
        }

        $source = MenuCategory::find($fromId);
        if ($source === null) {
            $this->error("Category #{$fromId} not found.");
            return self::FAILURE;
        }

        $dest = MenuCategory::where('restaurant_id', $source->restaurant_id)
            ->where('category_type', $type->value)
            ->first();

        if ($dest === null) {
            $this->error("No system '{$type->label()}' category found for restaurant #{$source->restaurant_id}.");
            return self::FAILURE;
        }

        $itemCount = $source->menuItems()->count();

        $this->line("Source : #{$source->id} "{$source->name}" ({$itemCount} item(s)) — restaurant #{$source->restaurant_id}");
        $this->line("Dest   : #{$dest->id} "{$dest->name}" (system: {$type->value})");

        if ($dryRun) {
            $this->info("DRY RUN — no changes made.");
            return self::SUCCESS;
        }

        DB::transaction(function () use ($source, $dest): void {
            DB::table('menu_items')
                ->where('menu_category_id', $source->id)
                ->update(['menu_category_id' => $dest->id]);

            $source->delete();
        });

        $this->info("Done. Moved {$itemCount} item(s) from #{$source->id} → #{$dest->id} and soft-deleted the source.");
        return self::SUCCESS;
    }
}
