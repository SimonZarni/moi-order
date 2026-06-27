<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\FileStorageInterface;
use App\Enums\SafetyCategory;
use App\Exports\SafetyLocationsExport;
use App\Imports\SafetyLocationsImport;
use App\Models\SafetyLocation;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class SafetyLocationService
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    public function list(?SafetyCategory $category, ?string $search, int $perPage = 20): LengthAwarePaginator
    {
        $query = SafetyLocation::orderBy('sort_order')->orderBy('name');

        if ($category !== null) {
            $query->byCategory($category);
        }

        if ($search !== null && $search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage);
    }

    /** @param array<string, mixed> $data */
    public function create(array $data): SafetyLocation
    {
        return SafetyLocation::create([
            'name'         => $data['name'],
            'category'     => $data['category'],
            'sub_category' => $data['sub_category'] ?? null,
            'sort_order'   => $data['sort_order'] ?? 0,
            'phone'        => $data['phone'] ?? null,
            'location'     => $data['location'] ?? null,
            'fb_page_link' => $data['fb_page_link'] ?? null,
            'gmap_link'    => $data['gmap_link'] ?? null,
            'description'  => $data['description'] ?? null,
            'latitude'     => $data['latitude'] ?? null,
            'longitude'    => $data['longitude'] ?? null,
            'photo_paths'  => [],
        ]);
    }

    /** @param array<string, mixed> $data */
    public function update(SafetyLocation $location, array $data): SafetyLocation
    {
        $updates = [];
        $scalar  = ['name', 'category', 'sub_category', 'phone', 'location',
                    'fb_page_link', 'gmap_link', 'description', 'latitude', 'longitude'];
        foreach ($scalar as $key) {
            if (array_key_exists($key, $data)) {
                $updates[$key] = $data[$key];
            }
        }
        if (array_key_exists('sort_order', $data)) {
            $updates['sort_order'] = $data['sort_order'] ?? 0;
        }

        if (! empty($updates)) {
            $location->update($updates);
        }

        return $location->fresh();
    }

    public function delete(SafetyLocation $location): void
    {
        $location->delete();
    }

    public function addPhoto(SafetyLocation $location, UploadedFile $file): SafetyLocation
    {
        $path   = $this->storage->store($file, 'safety-locations');
        $photos = $location->photo_paths ?? [];
        $photos[] = $path;
        $location->update(['photo_paths' => $photos]);

        return $location->fresh();
    }

    public function removePhoto(SafetyLocation $location, int $index): SafetyLocation
    {
        $photos = array_values($location->photo_paths ?? []);
        unset($photos[$index]);
        $location->update(['photo_paths' => array_values($photos)]);

        return $location->fresh();
    }

    public function setCoverPhoto(SafetyLocation $location, UploadedFile $file): SafetyLocation
    {
        $path = $this->storage->store($file, 'safety-locations/covers');
        $location->update(['cover_photo_path' => $path]);

        return $location->fresh();
    }

    public function removeCoverPhoto(SafetyLocation $location): SafetyLocation
    {
        $location->update(['cover_photo_path' => null]);

        return $location->fresh();
    }

    public function export(?SafetyCategory $category): BinaryFileResponse
    {
        $filename = ($category?->label() ?? 'Safety-Locations') . '-' . now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new SafetyLocationsExport($category), $filename);
    }

    public function import(UploadedFile $file, ?SafetyCategory $defaultCategory): int
    {
        $import = new SafetyLocationsImport();
        Excel::import($import, $file);

        $count = 0;

        foreach ($import->getRows() as $row) {
            $name     = trim((string) ($row['name'] ?? ''));
            $category = $row['category'] ?? $defaultCategory?->value;

            if ($name === '' || $category === null) {
                continue;
            }

            $cat = SafetyCategory::tryFrom(strtolower(str_replace([' ', '-'], '_', (string) $category)));
            if ($cat === null) {
                continue;
            }

            SafetyLocation::create([
                'name'         => $name,
                'category'     => $cat,
                'phone'        => $this->nullableStr($row['phone'] ?? null),
                'location'     => $this->nullableStr($row['location'] ?? null),
                'fb_page_link' => $this->nullableStr($row['fb_page_link'] ?? $row['fb page link'] ?? null),
                'gmap_link'    => $this->nullableStr($row['gmap_link'] ?? $row['google maps link'] ?? null),
                'description'  => $this->nullableStr($row['description'] ?? null),
                'latitude'     => is_numeric($row['latitude'] ?? null) ? (float) $row['latitude'] : null,
                'longitude'    => is_numeric($row['longitude'] ?? null) ? (float) $row['longitude'] : null,
                'photo_paths'  => [],
            ]);

            $count++;
        }

        return $count;
    }

    private function nullableStr(mixed $value): ?string
    {
        if ($value === null || trim((string) $value) === '') {
            return null;
        }

        return trim((string) $value);
    }
}
