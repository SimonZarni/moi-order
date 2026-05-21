<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class UserExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(private readonly array $filters) {}

    public function query(): Builder
    {
        $query = User::withTrashed()->latest();

        if (! empty($this->filters['search'])) {
            $term = $this->filters['search'];
            $query->where(function ($q) use ($term): void {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('email', 'like', "%{$term}%");
            });
        }

        if (! empty($this->filters['date_from'])) {
            $query->whereDate('created_at', '>=', $this->filters['date_from']);
        }

        if (! empty($this->filters['date_to'])) {
            $query->whereDate('created_at', '<=', $this->filters['date_to']);
        }

        return $query;
    }

    public function headings(): array
    {
        return ['ID', 'Name', 'Email', 'Phone', 'Status', 'Is Admin', 'Is Merchant', 'Role', 'Registered At', 'Last Active At', 'Deleted At'];
    }

    /** @param User $user */
    public function map($user): array
    {
        return [
            $user->id,
            $user->name,
            $user->email,
            $user->phone_number ?? '—',
            $user->status->value,
            $user->is_admin ? 'Yes' : 'No',
            $user->is_merchant ? 'Yes' : 'No',
            $user->user_role?->value ?? '—',
            $user->created_at?->format('Y-m-d H:i:s'),
            $user->last_active_at?->format('Y-m-d H:i:s') ?? '—',
            $user->deleted_at?->format('Y-m-d H:i:s') ?? '—',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function title(): string
    {
        return 'Users';
    }
}
