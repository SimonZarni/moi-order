<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\MenuCategory;
use Illuminate\Console\Command;

class DeduplicateSystemCategories extends Command
{
    protected $signature = 'restaurants:deduplicate-system-categories';

    protected $description = 'Remove duplicate system categories, keeping the one that has menu items';

    public function handle(): int
    {
        $deleted = 0;

        $groups = MenuCategory::whereNotNull('category_type')
            ->get()
            ->groupBy(fn ($c) => $c->restaurant_id . '-' . $c->category_type->value)
            ->filter(fn ($g) => $g->count() > 1);

        if ($groups->isEmpty()) {
            $this->info('No duplicates found.');
            return self::SUCCESS;
        }

        foreach ($groups as $group) {
            $withItems = $group->filter(fn ($c) => $c->menuItems()->exists());
            $keep      = $withItems->isNotEmpty()
                ? $withItems->sortByDesc('id')->first()
                : $group->sortByDesc('id')->first();

            foreach ($group as $c) {
                if ($c->id !== $keep->id) {
                    $c->delete();
                    $this->line("Soft-deleted #{$c->id} ({$c->name}) on restaurant #{$c->restaurant_id}");
                    $deleted++;
                }
            }
        }

        $this->info("Done. Removed {$deleted} duplicate(s).");
        return self::SUCCESS;
    }
}
