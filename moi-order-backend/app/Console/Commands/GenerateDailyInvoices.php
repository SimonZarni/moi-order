<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\DailyInvoiceService;
use Carbon\Carbon;
use Illuminate\Console\Command;

/**
 * Principle: SRP — delegates all business logic to DailyInvoiceService.
 *
 * Usage:
 *   php artisan invoices:generate-daily             # yesterday
 *   php artisan invoices:generate-daily --date=2026-06-20   # specific date
 */
class GenerateDailyInvoices extends Command
{
    protected $signature = 'invoices:generate-daily
                            {--date= : Target date (Y-m-d). Defaults to yesterday.}';

    protected $description = 'Generate daily cashout invoices for all restaurants.';

    public function __construct(private readonly DailyInvoiceService $service)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $dateStr = $this->option('date');

        if ($dateStr !== null) {
            try {
                $date = Carbon::createFromFormat('Y-m-d', $dateStr);
                if ($date === false) {
                    throw new \InvalidArgumentException();
                }
            } catch (\Throwable) {
                $this->error("Invalid date format. Use Y-m-d (e.g. 2026-06-20).");
                return self::FAILURE;
            }
        } else {
            $date = Carbon::yesterday();
        }

        $this->info("Generating invoices for {$date->toDateString()} …");

        $this->service->generateForDate($date);

        $this->info('Done.');
        return self::SUCCESS;
    }
}
