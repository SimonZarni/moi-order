<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\RestaurantPlatformStatus;
use App\Enums\RestaurantStatus;
use App\Models\Restaurant;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class AutoOpenCloseRestaurants extends Command
{
    protected $signature = 'restaurants:auto-open-close {--dry-run : Preview changes without applying}';

    protected $description = 'Auto-open and auto-close restaurants based on their weekly opening hours.';

    public function handle(): int
    {
        $now        = Carbon::now('Asia/Bangkok');
        $dayOfWeek  = $now->dayOfWeek; // 0 = Sunday … 6 = Saturday
        $time       = $now->format('H:i:s');
        $dryRun     = (bool) $this->option('dry-run');

        $restaurants = Restaurant::where('platform_status', RestaurantPlatformStatus::Active->value)
            ->with(['openingHours' => fn ($q) => $q->where('day_of_week', $dayOfWeek)])
            ->get();

        $opened = 0;
        $closed = 0;

        foreach ($restaurants as $restaurant) {
            // Merchant has manually overridden the status — leave it alone until
            // the 3-hour window expires, then it will be corrected on the next run.
            if ($restaurant->isOverrideActive()) {
                continue;
            }

            $hours = $restaurant->openingHours->first();

            // No hours record for today, or day explicitly marked closed → close
            if ($hours === null || $hours->is_closed) {
                if ($restaurant->status === RestaurantStatus::Open) {
                    $this->line("[CLOSE] {$restaurant->name} — no hours / day off");
                    if (! $dryRun) {
                        $restaurant->markAsClosed();
                    }
                    $closed++;
                }
                continue;
            }

            // Hours not fully configured — merchant has not set times yet, skip
            if ($hours->opens_at === null || $hours->closes_at === null) {
                continue;
            }

            $withinHours = $time >= $hours->opens_at && $time < $hours->closes_at;

            if ($withinHours && $restaurant->status !== RestaurantStatus::Open) {
                $this->line("[OPEN]  {$restaurant->name}");
                if (! $dryRun) {
                    $restaurant->markAsOpen();
                }
                $opened++;
            } elseif (! $withinHours && $restaurant->status === RestaurantStatus::Open) {
                $this->line("[CLOSE] {$restaurant->name}");
                if (! $dryRun) {
                    $restaurant->markAsClosed();
                }
                $closed++;
            }
        }

        $prefix = $dryRun ? '[dry-run] ' : '';
        $this->info("{$prefix}Opened: {$opened}  Closed: {$closed}");

        return Command::SUCCESS;
    }
}
