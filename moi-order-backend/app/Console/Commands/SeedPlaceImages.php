<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Contracts\FileStorageInterface;
use App\Contracts\ImageProviderInterface;
use App\Models\Place;
use App\Models\PlaceImage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SeedPlaceImages extends Command
{
    protected $signature = 'places:seed-images
                            {--count=5   : Number of images to fetch per place}
                            {--force     : Re-seed places that already have images}
                            {--dry-run   : Preview without writing anything}';

    protected $description = 'Fetch images from Unsplash and populate place_images for every place.';

    public function __construct(
        private readonly ImageProviderInterface $imageProvider,
        private readonly FileStorageInterface $fileStorage,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $count  = max(1, (int) $this->option('count'));
        $force  = (bool) $this->option('force');
        $dryRun = (bool) $this->option('dry-run');

        $places = Place::query()
            ->with('category')
            ->when(! $force, fn ($q) => $q->whereDoesntHave('images'))
            ->get();

        if ($places->isEmpty()) {
            $this->info('All places already have images. Use --force to re-seed.');
            return self::SUCCESS;
        }

        $this->info("Seeding {$count} image(s) for {$places->count()} place(s)".($dryRun ? ' [dry-run]' : '').'...');

        foreach ($places as $place) {
            $this->line("→ [{$place->id}] {$place->name_en}");

            $query = trim("{$place->name_en} {$place->category?->name_en} {$place->city}");

            if ($dryRun) {
                $this->line("  [dry-run] Would search: \"{$query}\"");
                continue;
            }

            try {
                $this->line("  Searching: \"{$query}\"");
                $files = $this->imageProvider->fetchImages($query, $count);

                if (empty($files)) {
                    $this->warn("  No images returned from provider, skipping.");
                    continue;
                }

                foreach ($files as $index => $file) {
                    $path = $this->fileStorage->store($file, 'places');

                    PlaceImage::create([
                        'place_id'   => $place->id,
                        'path'       => $path,
                        'sort_order' => $index,
                    ]);

                    @unlink($file->getPathname());
                }

                $this->info("  ✓ ".count($files)." image(s) stored.");
            } catch (\Throwable $e) {
                $this->warn("  ⚠  Failed: {$e->getMessage()}");
                Log::warning('SeedPlaceImages: failed for place', [
                    'place_id' => $place->id,
                    'name_en'  => $place->name_en,
                    'error'    => $e->getMessage(),
                ]);
            }

            sleep(1);
        }

        $this->info('Done.');
        return self::SUCCESS;
    }
}
