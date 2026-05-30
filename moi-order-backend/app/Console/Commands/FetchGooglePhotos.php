<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Place;
use App\Services\AdminGooglePhotoService;
use Illuminate\Console\Command;

/**
 * Bulk-fetches Google photos for every place that has a google_place_id.
 * Downloads each photo → stores to R2 → saves to place_photos table.
 *
 * Run once after places:match-google to populate the whole library.
 * The admin then opens each place in the dashboard and picks their favourites.
 *
 * Usage:
 *   php artisan places:fetch-google-photos            # only places with no photos yet
 *   php artisan places:fetch-google-photos --all      # re-fetch every place (overwrites)
 *   php artisan places:fetch-google-photos --dry-run  # preview without fetching
 */
class FetchGooglePhotos extends Command
{
    protected $signature = 'places:fetch-google-photos
        {--all      : Re-fetch places that already have Google photos stored}
        {--dry-run  : Print what would be fetched without downloading anything}';

    protected $description = 'Bulk-fetch Google photos for all matched places → store in R2 → save to place_photos';

    public function __construct(private readonly AdminGooglePhotoService $photoService)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $isDryRun     = $this->option('dry-run');
        $reprocessAll = $this->option('all');

        // Only process places that have a google_place_id set.
        $query = Place::query()
            ->whereNull('deleted_at')
            ->whereNotNull('google_place_id');

        if (! $reprocessAll) {
            // Skip places that already have photos in place_photos (already fetched).
            $query->whereDoesntHave('googlePhotos');
        }

        $places = $query->get();

        if ($places->isEmpty()) {
            $this->info('No places to fetch. All matched places already have photos (use --all to re-fetch).');
            return Command::SUCCESS;
        }

        $this->info("Fetching Google photos for {$places->count()} place(s)…");
        if ($isDryRun) {
            $this->warn('DRY RUN — nothing will be downloaded or stored.');
        }

        $total   = 0;
        $success = 0;
        $empty   = 0;
        $failed  = 0;

        foreach ($places as $place) {
            $total++;

            if ($isDryRun) {
                $this->line("  🔍 [{$place->id}] {$place->name_en} → would fetch (ID: {$place->google_place_id})");
                continue;
            }

            try {
                $photos = $this->photoService->fetchAndStore($place);

                if ($photos->isEmpty()) {
                    $empty++;
                    $this->warn("  📭 [{$place->id}] {$place->name_en} → 0 photos returned by Google");
                } else {
                    $success++;
                    $this->info("  ✅ [{$place->id}] {$place->name_en} → {$photos->count()} photos stored");
                }
            } catch (\Throwable $e) {
                $failed++;
                $this->error("  ❌ [{$place->id}] {$place->name_en} → ERROR: {$e->getMessage()}");
            }

            // 300ms between places to be respectful of Google's rate limit.
            usleep(300_000);
        }

        $this->newLine();

        if ($isDryRun) {
            $this->warn("DRY RUN complete — {$total} places would be processed.");
            return Command::SUCCESS;
        }

        $this->table(
            ['Metric', 'Count'],
            [
                ['Total processed',        $total],
                ['Photos stored (✅)',      $success],
                ['No photos from Google',  $empty],
                ['Errors (❌)',             $failed],
            ]
        );

        $this->newLine();
        $this->info('Done. Open any place in the admin dashboard to review and add photos to the gallery.');

        return Command::SUCCESS;
    }
}
