<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\KycDocumentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Principle: SRP — one entity: a single KYC uploaded file.
 * Principle: Security — file_path never exposed directly; signed URLs produced in Resource.
 */
class KycDocument extends Model
{
    use SoftDeletes;

    /**
     * @var list<string>
     * Principle: Security — $fillable explicit, never $guarded=[].
     */
    protected $fillable = [
        'kyc_application_id',
        'type',
        'file_path',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'type' => KycDocumentType::class,
        ];
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function kycApplication(): BelongsTo
    {
        return $this->belongsTo(KycApplication::class);
    }
}
