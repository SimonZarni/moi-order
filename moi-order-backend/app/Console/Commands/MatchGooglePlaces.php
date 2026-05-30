<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\GooglePlacesInterface;
use App\Enums\GoogleMatchStatus;
use App\Models\Place;
use Illuminate\Console\Command;

/**
 * Principle: SRP — command owns only orchestration; API calls are in GooglePlacesService.
 *
 * Usage:
 *   php artisan places:match-google            # all unmatched places
 *   php artisan places:match-google --all      # re-process every place (overwrites existing)
 *   php artisan places:match-google --dry-run  # print what would happen, no DB writes
 */
class MatchGooglePlaces extends Command
{
    protected $signature = 'places:match-google
        {--all      : Re-process every place, including ones already matched}
        {--dry-run  : Print results without writing to the database}';

    protected $description = 'Auto-match each Place to its Google Place ID using the Text Search API';

    public function __construct(private readonly GooglePlacesInterface $googlePlaces)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $reprocessAll = $this->option('all');

        $query = Place::query()->whereNull('deleted_at');

        if (! $reprocessAll) {
            $query->whereNull('google_place_id');
        }

        $places = $query->get();

        if ($places->isEmpty()) {
            $this->info('No places to process.');
            return Command::SUCCESS;
        }

        $this->info("Processing {$places->count()} place(s)…");
        if ($isDryRun) {
            $this->warn('DRY RUN — no database writes will be made.');
        }

        $total   = 0;
        $matched = 0;
        $notFound = 0;

        foreach ($places as $place) {
            $total++;
            $query  = trim("{$place->name_en} {$place->city}");
            $lat    = (float) ($place->latitude  ?? 0);
            $lng    = (float) ($place->longitude ?? 0);

            if (! $query) {
                $this->line("  ⏭  [{$place->id}] Skipped — no name_en + city");
                continue;
            }

            $results = $this->googlePlaces->searchText($query, $lat, $lng);

            if (empty($results)) {
                $notFound++;
                $this->warn("  ⚠  [{$place->id}] {$place->name_en} → NOT FOUND");

                if (! $isDryRun) {
                    $place->update(['google_match_status' => GoogleMatchStatus::NeedsManual->value]);
                }
            } else {
                $matched++;
                $hit = $results[0];
                $this->info("  ✅ [{$place->id}] {$place->name_en} → {$hit['displayName']} ({$hit['id']})");

                if (! $isDryRun) {
                    $place->update([
                        'google_place_id'     => $hit['id'],
                        'google_match_status' => GoogleMatchStatus::AutoMatched->value,
                    ]);
                }
            }

            // Respect Google's rate limit — 300ms between requests.
            usleep(300_000);
        }

        $this->newLine();
        $this->table(
            ['Metric', 'Count'],
            [
                ['Total processed', $total],
                ['Auto-matched',    $matched],
                ['Not found',       $notFound],
            ]
        );

        if ($isDryRun) {
            $this->warn('DRY RUN complete — no changes written.');
        }

        return Command::SUCCESS;
    }
}
