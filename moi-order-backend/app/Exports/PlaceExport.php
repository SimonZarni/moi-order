<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Place;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PlaceExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(private readonly array $filters) {}

    public function query(): Builder
    {
        $query = Place::withTrashed()->with(['categories'])->latest();

        if (! empty($this->filters['city'])) {
            $query->where('city', $this->filters['city']);
        }

        if (! empty($this->filters['category_id'])) {
            $query->whereHas('categories', fn ($q) =>
                $q->where('categories.id', (int) $this->filters['category_id'])
            );
        }

        if (! empty($this->filters['search'])) {
            $term = $this->filters['search'];
            $query->where(function ($q) use ($term): void {
                $q->where('name_en', 'like', "%{$term}%")
                  ->orWhere('name_my', 'like', "%{$term}%")
                  ->orWhere('city', 'like', "%{$term}%");
            });
        }

        return $query;
    }

    public function headings(): array
    {
        return ['ID', 'Name (Myanmar)', 'Name (English)', 'Name (Thai)', 'Categories', 'City', 'Address', 'Contact Phone', 'Website', 'Google Map URL', 'Status', 'Created At'];
    }

    /** @param Place $place */
    public function map($place): array
    {
        $categories = $place->categories->map(fn ($c) => $c->name_my ?? $c->name_en ?? '?')->implode(', ');

        return [
            $place->id,
            $place->name_my,
            $place->name_en ?? '—',
            $place->name_th ?? '—',
            $categories ?: '—',
            $place->city ?? '—',
            $place->address ?? '—',
            $place->contact_phone ?? '—',
            $place->website ?? '—',
            $place->google_map_url ?? '—',
            $place->deleted_at ? 'Deleted' : 'Active',
            $place->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function title(): string
    {
        return 'Places';
    }
}
