<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubmissionDocument extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'submission_id',
        'document_type_id',
        'file_path',
    ];

    protected $hidden = [
        'file_path',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(ServiceSubmission::class, 'submission_id');
    }

    public function documentType(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }
}
