<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\TicketOrder;
use App\Models\TicketOrderItem;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TicketOrderExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(private readonly array $filters) {}

    public function query(): Builder
    {
        $query = TicketOrder::with(['user', 'ticket', 'items'])->orderByDesc('created_at');

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->whereHas('ticket', fn ($tq) => $tq->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('user', fn ($uq) =>
                      $uq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%")
                  );
            });
        }

        return $query;
    }

    public function headings(): array
    {
        return ['ID', 'Ticket Name', 'Customer Name', 'Customer Email', 'Status', 'Visit Date', 'Total (THB)', 'Payment Authorized', 'Created At', 'Completed At'];
    }

    /** @param TicketOrder $order */
    public function map($order): array
    {
        $totalThb = $order->items->sum(fn (TicketOrderItem $i) => $i->subtotalThb());

        return [
            $order->id,
            $order->ticket?->name ?? '—',
            $order->user?->name ?? '—',
            $order->user?->email ?? '—',
            $order->status->value,
            $order->visit_date?->format('Y-m-d'),
            number_format($totalThb, 2),
            $order->payment_authorized ? 'Yes' : 'No',
            $order->created_at?->format('Y-m-d H:i:s'),
            $order->completed_at?->format('Y-m-d H:i:s') ?? '—',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function title(): string
    {
        return 'Ticket Orders';
    }
}
