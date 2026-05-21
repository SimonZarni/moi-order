<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\FoodOrder;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class FoodOrderExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(private readonly array $filters) {}

    public function query(): Builder
    {
        $query = FoodOrder::with(['user', 'restaurant'])->orderByDesc('created_at');

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['restaurant_id'])) {
            $query->where('restaurant_id', (int) $this->filters['restaurant_id']);
        }

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->whereHas('user', fn ($uq) =>
                    $uq->where('name', 'like', "%{$search}%")
                       ->orWhere('email', 'like', "%{$search}%")
                )->orWhereHas('restaurant', fn ($rq) =>
                    $rq->where('name', 'like', "%{$search}%")
                );
            });
        }

        return $query;
    }

    public function headings(): array
    {
        return ['Order Number', 'Restaurant', 'Customer Name', 'Customer Email', 'Status', 'Payment Method', 'Total (THB)', 'Delivery Address', 'Created At', 'Completed At', 'Cancelled At'];
    }

    /** @param FoodOrder $order */
    public function map($order): array
    {
        return [
            $order->order_number ?? $order->uuid,
            $order->restaurant?->name ?? '—',
            $order->user?->name ?? '—',
            $order->user?->email ?? '—',
            $order->status->label(),
            $order->payment_method->value,
            number_format($order->total_cents / 100, 2),
            $order->delivery_address ?? '—',
            $order->created_at?->format('Y-m-d H:i:s'),
            $order->completed_at?->format('Y-m-d H:i:s') ?? '—',
            $order->cancelled_at?->format('Y-m-d H:i:s') ?? '—',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function title(): string
    {
        return 'Food Orders';
    }
}
