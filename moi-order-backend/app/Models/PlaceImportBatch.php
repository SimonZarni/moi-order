<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\PlaceImportBatchStatus;
use Illuminate\Database\Eloquent\Model;

/**
 * Principle: SRP — tracks the lifecycle of a single Excel import job.
 * Principle: Encapsulation — state transitions via domain methods only.
 * Principle: Tell-Don't-Ask — callers request a transition, not a raw status write.
 */
class PlaceImportBatch extends Model
{
    protected $fillable = [
        'status',
        'file_path',
        'total',
        'imported',
        'failed',
        'errors',
    ];

    protected $casts = [
        'status' => PlaceImportBatchStatus::class,
        'errors' => 'array',
    ];

    // ─── Domain methods ───────────────────────────────────────────────────────

    public function markProcessing(): void
    {
        $this->update(['status' => PlaceImportBatchStatus::Processing]);
    }

    public function markCompleted(int $total, int $imported, int $failed, array $errors): void
    {
        $this->update([
            'status'   => PlaceImportBatchStatus::Completed,
            'total'    => $total,
            'imported' => $imported,
            'failed'   => $failed,
            'errors'   => $errors,
        ]);
    }

    public function markFailed(string $message): void
    {
        $this->update([
            'status' => PlaceImportBatchStatus::Failed,
            'errors' => [['row' => 0, 'message' => $message]],
        ]);
    }
}
