<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\ServiceSubmission;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SubmissionExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(private readonly array $filters) {}

    public function query(): Builder
    {
        $query = ServiceSubmission::with([
            'user',
            'serviceType' => fn ($q) => $q->withTrashed()->with(['service' => fn ($q) => $q->withTrashed()]),
        ])->latest();

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['service_id'])) {
            $query->whereHas('serviceType', function ($q): void {
                $q->where('service_id', (int) $this->filters['service_id']);
            });
        }

        if (! empty($this->filters['user_id'])) {
            $query->where('user_id', (int) $this->filters['user_id']);
        }

        if (! empty($this->filters['date_from'])) {
            $query->whereDate('created_at', '>=', $this->filters['date_from']);
        }

        if (! empty($this->filters['date_to'])) {
            $query->whereDate('created_at', '<=', $this->filters['date_to']);
        }

        if (! empty($this->filters['search'])) {
            $term = $this->filters['search'];
            $query->where(function ($q) use ($term): void {
                $q->where('id', $term)
                  ->orWhereHas('user', function ($uq) use ($term): void {
                      $uq->where('email', 'like', "%{$term}%")
                         ->orWhere('name', 'like', "%{$term}%");
                  });
            });
        }

        return $query;
    }

    public function headings(): array
    {
        return ['ID', 'User Name', 'User Email', 'Service', 'Service Type', 'Status', 'Price (THB)', 'Payment Authorized', 'Submitted At', 'Completed At'];
    }

    /** @param ServiceSubmission $submission */
    public function map($submission): array
    {
        $serviceName     = $submission->serviceType?->service?->name ?? '—';
        $serviceTypeName = $submission->serviceType?->name ?? '—';

        return [
            $submission->id,
            $submission->user?->name ?? '—',
            $submission->user?->email ?? '—',
            $serviceName,
            $serviceTypeName,
            $submission->status->value,
            number_format($submission->price_snapshot, 2),
            $submission->payment_authorized ? 'Yes' : 'No',
            $submission->created_at?->format('Y-m-d H:i:s'),
            $submission->completed_at?->format('Y-m-d H:i:s') ?? '—',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function title(): string
    {
        return 'Submissions';
    }
}
