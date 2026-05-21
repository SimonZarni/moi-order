<?php

declare(strict_types=1);

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DashboardExport implements FromArray, ShouldAutoSize, WithStyles, WithTitle
{
    /** Row numbers (1-based) of section header rows — populated during array(). */
    private array $sectionHeaderRows = [];

    /** Row numbers of column-header rows inside each section. */
    private array $columnHeaderRows = [];

    /** Row number of the report title. */
    private int $titleRow = 1;

    public function __construct(private readonly array $data) {}

    public function array(): array
    {
        $rows   = [];
        $rowNum = 1;

        // ── Report title ──────────────────────────────────────────────────────

        $this->titleRow = $rowNum;
        $rows[]         = ['OVERVIEW REPORT — Generated ' . now()->format('d M Y, H:i')];
        $rowNum++;

        $rows[] = [];
        $rowNum++;

        // ── Section 1: KPI Summary ────────────────────────────────────────────

        $this->sectionHeaderRows[] = $rowNum;
        $rows[]                    = ['KPI SUMMARY'];
        $rowNum++;

        $this->columnHeaderRows[] = $rowNum;
        $rows[]                   = ['Metric', 'All Time', 'This Month', 'Last Month', 'MoM Change (%)'];
        $rowNum++;

        $s = $this->data['summary'];
        $rows[] = ['Total Orders', $s['total_orders'], $s['orders_this_month'], $s['orders_last_month'], $this->fChange($s['total_orders_change'])];
        $rowNum++;
        $rows[] = ['Active Users', $s['active_users'], $s['users_this_month'], $s['users_last_month'], $this->fChange($s['active_users_change'])];
        $rowNum++;
        $rows[] = ['Listed Places', $s['listed_places'], $s['places_this_month'], $s['places_last_month'], $this->fChange($s['listed_places_change'])];
        $rowNum++;
        $rows[] = ['Revenue (THB)', '—', $this->fThb($s['total_revenue']), $this->fThb($s['revenue_last_month']), $this->fChange($s['revenue_change'])];
        $rowNum++;

        $rows[] = [];
        $rowNum++;

        // ── Section 2: 8-Month Trend ──────────────────────────────────────────

        $this->sectionHeaderRows[] = $rowNum;
        $rows[]                    = ['8-MONTH TREND'];
        $rowNum++;

        $this->columnHeaderRows[] = $rowNum;
        $rows[]                   = ['Month', 'Total Orders', 'New Users', 'New Places', 'Revenue (THB)'];
        $rowNum++;

        $monthLabels = $this->lastEightMonthLabels();
        for ($i = 0; $i < 8; $i++) {
            $rows[] = [
                $monthLabels[$i],
                $s['total_orders_monthly'][$i] ?? 0,
                $s['active_users_monthly'][$i] ?? 0,
                $s['listed_places_monthly'][$i] ?? 0,
                $this->fThb($s['revenue_monthly'][$i] ?? 0),
            ];
            $rowNum++;
        }

        $rows[] = [];
        $rowNum++;

        // ── Section 3: Monthly Orders (this year vs last year) ────────────────

        $monthly = $this->data['monthly_orders'];

        $this->sectionHeaderRows[] = $rowNum;
        $rows[]                    = ['MONTHLY ORDERS (THIS YEAR VS LAST YEAR)'];
        $rowNum++;

        $this->columnHeaderRows[] = $rowNum;
        $rows[]                   = ['Month', 'This Year', 'Last Year'];
        $rowNum++;

        foreach ($monthly['labels'] as $i => $label) {
            $rows[] = [$label, $monthly['this_year'][$i] ?? 0, $monthly['last_year'][$i] ?? 0];
            $rowNum++;
        }

        $rows[] = [];
        $rowNum++;

        // ── Section 4: Orders by Service ──────────────────────────────────────

        $this->sectionHeaderRows[] = $rowNum;
        $rows[]                    = ['ORDERS BY SERVICE'];
        $rowNum++;

        $this->columnHeaderRows[] = $rowNum;
        $rows[]                   = ['Service', 'Total Orders'];
        $rowNum++;

        foreach ($this->data['orders_by_service'] as $item) {
            $rows[] = [$item['label'], $item['value']];
            $rowNum++;
        }

        $rows[] = [];
        $rowNum++;

        // ── Section 5: Top Services ────────────────────────────────────────────

        $top = $this->data['top_services_comparison'];

        $this->sectionHeaderRows[] = $rowNum;
        $rows[]                    = ['TOP SERVICES (THIS MONTH VS LAST MONTH)'];
        $rowNum++;

        $this->columnHeaderRows[] = $rowNum;
        $rows[]                   = ['Service', 'This Month', 'Last Month'];
        $rowNum++;

        foreach ($top['categories'] as $i => $category) {
            $rows[] = [$category, $top['this_month'][$i] ?? 0, $top['last_month'][$i] ?? 0];
            $rowNum++;
        }

        $rows[] = [];
        $rowNum++;

        // ── Section 6: Submission Status Breakdown ────────────────────────────

        $breakdown = $this->data['submission_status_breakdown'];
        $thisYear  = $breakdown['series'][0]['data'] ?? [];
        $lastYear  = $breakdown['series'][1]['data'] ?? [];

        $this->sectionHeaderRows[] = $rowNum;
        $rows[]                    = ['SUBMISSION STATUS BREAKDOWN (THIS YEAR VS LAST YEAR)'];
        $rowNum++;

        $this->columnHeaderRows[] = $rowNum;
        $rows[]                   = ['Status', 'This Year', 'Last Year'];
        $rowNum++;

        foreach ($breakdown['categories'] as $i => $category) {
            $rows[] = [$category, $thisYear[$i] ?? 0, $lastYear[$i] ?? 0];
        }

        return $rows;
    }

    public function styles(Worksheet $sheet): array
    {
        // Title
        $sheet->getStyle("A{$this->titleRow}")->getFont()->setBold(true)->setSize(13);

        // Section headers — teal background, white bold text
        foreach ($this->sectionHeaderRows as $row) {
            $style = $sheet->getStyle("A{$row}:E{$row}");
            $style->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
            $style->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('0D9488');
        }

        // Column headers — light grey background, bold text
        foreach ($this->columnHeaderRows as $row) {
            $style = $sheet->getStyle("A{$row}:E{$row}");
            $style->getFont()->setBold(true);
            $style->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('F1F5F9');
        }

        return [];
    }

    public function title(): string
    {
        return 'Overview';
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function fChange(?float $change): string
    {
        if ($change === null) {
            return '—';
        }

        return ($change >= 0 ? '+' : '') . $change . '%';
    }

    private function fThb(int $satangs): string
    {
        return number_format($satangs / 100, 2);
    }

    /** Labels for the last 8 months in "MMM YYYY" format, oldest first. */
    private function lastEightMonthLabels(): array
    {
        return collect(range(7, 0))
            ->map(fn (int $i) => now()->subMonths($i)->format('M Y'))
            ->all();
    }
}
