<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — owns the reference to a single uploaded document file.
 * Security: file_path is opaque (UUID-named, stored outside public/).
 *   Signed URLs are generated at read time via FileStorageInterface.
 *   The raw path is never exposed in API responses.
 */
class SubmissionDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'submission_id',
        'document_type',
        'file_path',
    ];

    protected $hidden = [
        'file_path', // raw path never serialised; signed URL generated in Resource
    ];

    protected function casts(): array
    {
        return [
            'document_type' => DocumentType::class,
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ServiceSubmission::class, 'submission_id');
    }
}
