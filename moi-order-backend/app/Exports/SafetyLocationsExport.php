<?php

declare(strict_types=1);

namespace App\Exports;

use App\Enums\SafetyCategory;
use App\Models\SafetyLocation;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SafetyLocationsExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(private readonly ?SafetyCategory $category = null) {}

    public function query(): Builder
    {
        $query = SafetyLocation::orderBy('category')->orderBy('name');

        if ($this->category !== null) {
            $query->byCategory($this->category);
        }

        return $query;
    }

    public function headings(): array
    {
        return ['ID', 'Name', 'Category', 'Phone', 'Location', 'FB Page Link', 'Google Maps Link', 'Description', 'Latitude', 'Longitude'];
    }

    /** @param SafetyLocation $row */
    public function map($row): array
    {
        return [
            $row->id,
            $row->name,
            $row->category->value,
            $row->phone,
            $row->location,
            $row->fb_page_link,
            $row->gmap_link,
            $row->description,
            $row->latitude,
            $row->longitude,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function title(): string
    {
        return $this->category?->label() ?? 'Safety Locations';
    }
}
