<?php

declare(strict_types=1);

namespace App\Exports;

use App\Models\Payment;
use App\Models\ServiceSubmission;
use App\Models\TicketOrder;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PaymentExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(private readonly array $filters) {}

    public function query(): Builder
    {
        $query = Payment::with([
            'payable' => function (MorphTo $morphTo): void {
                $morphTo->morphWith([
                    ServiceSubmission::class => ['user'],
                    TicketOrder::class       => ['user'],
                ]);
            },
        ])->latest();

        if (! empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        if (! empty($this->filters['date_from'])) {
            $query->whereDate('created_at', '>=', $this->filters['date_from']);
        }

        if (! empty($this->filters['date_to'])) {
            $query->whereDate('created_at', '<=', $this->filters['date_to']);
        }

        if (! empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search): void {
                $q->whereHasMorph(
                    'payable',
                    [ServiceSubmission::class, TicketOrder::class],
                    fn ($sub) => $sub->whereHas(
                        'user',
                        fn ($uq) => $uq->where('name', 'like', "%{$search}%")
                                       ->orWhere('email', 'like', "%{$search}%")
                    )
                )->orWhere('stripe_intent_id', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    public function headings(): array
    {
        return ['ID', 'User Name', 'User Email', 'Type', 'Amount (THB)', 'Currency', 'Status', 'Stripe Intent ID', 'Created At'];
    }

    /** @param Payment $payment */
    public function map($payment): array
    {
        $user = $payment->payable?->user ?? null;
        $type = $payment->payable_type
            ? class_basename($payment->payable_type)
            : '—';

        return [
            $payment->id,
            $user?->name ?? '—',
            $user?->email ?? '—',
            $type,
            number_format($payment->amount / 100, 2),
            strtoupper($payment->currency),
            $payment->status->value,
            $payment->stripe_intent_id ?? '—',
            $payment->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [1 => ['font' => ['bold' => true]]];
    }

    public function title(): string
    {
        return 'Payments';
    }
}
