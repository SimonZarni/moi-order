<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\PlaceImportRowDTO;
use App\Enums\PlaceImportBatchStatus;
use App\Imports\PlacesImport;
use App\Jobs\ProcessPlacesImportJob;
use App\Models\Category;
use App\Models\Place;
use App\Models\PlaceImportBatch;
use App\Models\Tag;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Principle: SRP — owns Excel-to-database import logic for places.
 * Principle: CQS — queue() creates and dispatches; processFile() mutates state only.
 */
class AdminPlaceImportService
{
    /**
     * Store the uploaded file and dispatch the import job.
     * Returns the batch record immediately so the caller can return 202.
     */
    public function queue(UploadedFile $file): PlaceImportBatch
    {
        // Stored on local disk — the queue worker runs on the same filesystem.
        $path = $file->store('imports/places', 'local');

        $batch = PlaceImportBatch::create([
            'status'    => PlaceImportBatchStatus::Pending,
            'file_path' => $path,
        ]);

        ProcessPlacesImportJob::dispatch($batch);

        return $batch;
    }

    /**
     * Called by ProcessPlacesImportJob. Reads the stored file, processes every row,
     * updates the batch record, then removes the temp file.
     */
    public function processFile(PlaceImportBatch $batch): void
    {
        $batch->markProcessing();

        $import = new PlacesImport();
        Excel::import($import, $batch->file_path, 'local');

        $rows     = $import->getRows();
        $imported = 0;
        $errors   = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // row 1 = header
            try {
                $dto = PlaceImportRowDTO::fromRow($row->toArray());
                $this->validateRow($dto, $rowNumber);
                $this->processRow($dto);
                $imported++;
            } catch (\RuntimeException $e) {
                $errors[] = ['row' => $rowNumber, 'message' => $e->getMessage()];
            } catch (\Throwable $e) {
                $errors[] = ['row' => $rowNumber, 'message' => 'Unexpected error: ' . $e->getMessage()];
            }
        }

        $batch->markCompleted(count($rows), $imported, count($errors), $errors);

        // Clean up temp file after processing is complete.
        Storage::disk('local')->delete($batch->file_path);
    }

    private function validateRow(PlaceImportRowDTO $dto, int $row): void
    {
        $required = [
            'category_name_my'  => $dto->categoryNameMy,
            'category_name_en'  => $dto->categoryNameEn,
            'category_name_th'  => $dto->categoryNameTh,
            'name_my'           => $dto->nameMy,
            'name_en'           => $dto->nameEn,
            'name_th'           => $dto->nameTh,
            'short_description' => $dto->shortDescription,
            'long_description'  => $dto->longDescription,
            'address'           => $dto->address,
            'city'              => $dto->city,
        ];

        foreach ($required as $field => $value) {
            if ($value === '') {
                throw new \RuntimeException("Row {$row}: '{$field}' is required.");
            }
        }

        if (mb_strlen($dto->shortDescription) > 500) {
            throw new \RuntimeException("Row {$row}: 'short_description' must not exceed 500 characters.");
        }

        if (mb_strlen($dto->city) > 100) {
            throw new \RuntimeException("Row {$row}: 'city' must not exceed 100 characters.");
        }

        if ($dto->latitude !== null && ($dto->latitude < -90 || $dto->latitude > 90)) {
            throw new \RuntimeException("Row {$row}: 'latitude' must be between -90 and 90.");
        }

        if ($dto->longitude !== null && ($dto->longitude < -180 || $dto->longitude > 180)) {
            throw new \RuntimeException("Row {$row}: 'longitude' must be between -180 and 180.");
        }
    }

    private function processRow(PlaceImportRowDTO $dto): void
    {
        DB::transaction(function () use ($dto): void {
            $category = $this->resolveCategory($dto);
            $tagIds   = array_map(fn (string $name) => $this->resolveTag($name)->id, $dto->tags);

            $place = Place::create([
                'category_id'       => $category->id,
                'name_my'           => $dto->nameMy,
                'name_en'           => $dto->nameEn,
                'name_th'           => $dto->nameTh,
                'short_description' => $dto->shortDescription,
                'long_description'  => $dto->longDescription,
                'address'           => $dto->address,
                'city'              => $dto->city,
                'latitude'          => $dto->latitude,
                'longitude'         => $dto->longitude,
                'opening_hours'     => $dto->openingHours,
                'contact_phone'     => $dto->contactPhone,
                'website'           => $dto->website,
                'google_map_url'    => $dto->googleMapUrl,
            ]);

            if (! empty($tagIds)) {
                $place->tags()->sync($tagIds);
            }
        });
    }

    private function resolveCategory(PlaceImportRowDTO $dto): Category
    {
        return Category::firstOrCreate(
            ['name_en' => $dto->categoryNameEn],
            [
                'name_my' => $dto->categoryNameMy,
                'name_th' => $dto->categoryNameTh,
                'slug'    => $this->uniqueSlug($dto->categoryNameEn, 'categories'),
            ]
        );
    }

    private function resolveTag(string $name): Tag
    {
        return Tag::firstOrCreate(
            ['name_en' => $name],
            [
                'name_my' => $name,
                'name_th' => $name,
                'slug'    => $this->uniqueSlug($name, 'tags'),
            ]
        );
    }

    private function uniqueSlug(string $name, string $table): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i    = 1;

        while (DB::table($table)->where('slug', $slug)->whereNull('deleted_at')->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug !== '' ? $slug : 'place-' . Str::random(6);
    }
}
