<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\Contracts\GooglePlacesInterface;
use App\Models\Place;
use App\Models\PlaceImage;
use App\Models\PlacePhoto;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Principle: SRP — owns the "fetch Google photos → R2 → place_photos" pipeline only.
 * Principle: DIP — depends on GooglePlacesInterface and FileStorageInterface abstractions.
 */
class AdminGooglePhotoService
{
    public function __construct(
        private readonly GooglePlacesInterface $googlePlaces,
        private readonly FileStorageInterface  $storage,
    ) {}

    /**
     * Delete existing Google photos for the place, fetch fresh ones from Google,
     * download each to R2, and persist records in place_photos.
     *
     * @return Collection<int, PlacePhoto>
     *
     * @throws \DomainException when the place has no google_place_id.
     */
    public function fetchAndStore(Place $place): Collection
    {
        if (! $place->google_place_id) {
            throw new \DomainException('place.no_google_place_id');
        }

        // Index existing records by google_photo_name so we can skip re-downloading
        // photos that are already stored in R2. This makes refresh near-instant when
        // Google returns the same set of photos (the common case).
        $existingByName = $place->googlePhotos()
            ->get()
            ->keyBy('google_photo_name');

        // Fetch photo metadata + media URIs from Google (two-step inside the service).
        $googlePhotos = $this->googlePlaces->fetchPlacePhotos($place->google_place_id, 10);

        if (empty($googlePhotos)) {
            return collect();
        }

        // Sort by name for a stable, deterministic display order across refreshes.
        usort($googlePhotos, fn (array $a, array $b): int => strcmp($a['name'], $b['name']));

        $returnedNames = array_column($googlePhotos, 'name');

        $saved = collect();

        DB::transaction(function () use ($place, $googlePhotos, $existingByName, $returnedNames, &$saved): void {
            // Remove any records for photos no longer returned by Google.
            $place->googlePhotos()->whereNotIn('google_photo_name', $returnedNames)->delete();

            foreach ($googlePhotos as $index => $gPhoto) {
                $existing = $existingByName->get($gPhoto['name']);

                if ($existing) {
                    // Already in R2 — just keep it and correct its display_order.
                    $existing->update(['display_order' => $index]);
                    $saved->push($existing->fresh());
                    continue;
                }

                // New photo from Google — download bytes and store to R2.
                try {
                    $response = Http::timeout(15)->get($gPhoto['photoUri']);

                    if (! $response->successful()) {
                        Log::warning('AdminGooglePhotoService: failed to download Google photo', [
                            'place_id' => $place->id,
                            'name'     => $gPhoto['name'],
                            'status'   => $response->status(),
                        ]);
                        continue;
                    }

                    $path = "places/{$place->id}/google/" . Str::uuid()->toString() . '.jpg';
                    $this->storage->storeRaw($response->body(), $path);
                    $publicUrl = $this->storage->publicUrl($path);

                    /** @var PlacePhoto $photo */
                    $photo = $place->googlePhotos()->create([
                        'photo_url'         => $publicUrl,
                        'google_photo_name' => $gPhoto['name'],
                        'display_order'     => $index,
                        'source'            => 'google',
                        'is_selected'       => false,
                        'width_px'          => $gPhoto['widthPx'],
                        'height_px'         => $gPhoto['heightPx'],
                        'author_name'       => $gPhoto['authorName'],
                    ]);

                    $saved->push($photo);
                } catch (\Throwable $e) {
                    Log::error('AdminGooglePhotoService: exception on photo download/store', [
                        'place_id' => $place->id,
                        'name'     => $gPhoto['name'],
                        'error'    => $e->getMessage(),
                    ]);
                }
            }
        });

        return $saved;
    }

    /**
     * Remove a Google photo from the place's real gallery.
     * Deletes the place_images row whose path matches the photo URL
     * and marks the place_photos record as deselected.
     *
     * @throws \InvalidArgumentException when the photo doesn't belong to the place.
     */
    public function removeFromGallery(Place $place, PlacePhoto $photo): void
    {
        if ($photo->place_id !== $place->id) {
            throw new \InvalidArgumentException('Photo does not belong to this place.');
        }

        DB::transaction(function () use ($place, $photo): void {
            // Find the place_images entry by the stored URL path (added via addToGallery).
            $place->images()->where('path', $photo->photo_url)->delete();

            $photo->update(['is_selected' => false]);
        });
    }

    /**
     * Copy a Google photo into the place's real gallery (place_images table).
     * Marks the place_photos record as selected so the admin UI reflects "Added ✓".
     *
     * Returns the new PlaceImage.
     *
     * @throws \InvalidArgumentException when the photo doesn't belong to the place.
     */
    public function addToGallery(Place $place, PlacePhoto $photo): PlaceImage
    {
        if ($photo->place_id !== $place->id) {
            throw new \InvalidArgumentException('Photo does not belong to this place.');
        }

        $nextOrder = $place->images()->max('sort_order') ?? -1;

        return DB::transaction(function () use ($place, $photo, $nextOrder): PlaceImage {
            // Mark as selected in the staging table.
            $photo->update(['is_selected' => true]);

            // Insert into the real gallery — the URL is already a public R2 URL.
            return $place->images()->create([
                'path'       => $photo->photo_url, // PlaceResource handles http: prefix correctly
                'sort_order' => $nextOrder + 1,
            ]);
        });
    }
}
