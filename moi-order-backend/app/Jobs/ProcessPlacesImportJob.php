<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\PlaceImportBatch;
use App\Services\AdminPlaceImportService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Principle: SRP — dispatches import processing to the queue worker.
 * Principle: DIP — delegates all logic to AdminPlaceImportService.
 */
class ProcessPlacesImportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 1;

    public function __construct(private readonly PlaceImportBatch $batch) {}

    public function handle(AdminPlaceImportService $service): void
    {
        $service->processFile($this->batch);
    }

    public function failed(\Throwable $e): void
    {
        $this->batch->markFailed('Job failed: ' . $e->getMessage());
    }
}
