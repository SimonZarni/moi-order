<?php

declare(strict_types=1);

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

/**
 * Principle: SRP — responsible only for converting the file into a Collection.
 * Business logic lives in AdminPlaceImportService.
 */
class PlacesImport implements ToCollection, WithHeadingRow
{
    private Collection $rows;

    public function collection(Collection $rows): void
    {
        $this->rows = $rows;
    }

    public function getRows(): Collection
    {
        return $this->rows ?? collect();
    }
}
