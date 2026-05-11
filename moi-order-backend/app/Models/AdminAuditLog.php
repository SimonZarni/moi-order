<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AuditAction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Principle: SRP — one append-only audit record per admin action.
 * Principle: Security — delete() throws to prevent tampering; no soft-deletes.
 * Append-only: UPDATED_AT is null (no updates ever). created_at is auto-set.
 */
class AdminAuditLog extends Model
{
    // No updated_at column in this table — records are never modified.
    const UPDATED_AT = null;

    protected $fillable = [
        'admin_id',
        'admin_name',
        'admin_email',
        'action',
        'entity_type',
        'entity_id',
        'entity_label',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'action'     => AuditAction::class,
            'old_values' => 'array',
            'new_values' => 'array',
            'metadata'   => 'array',
            'created_at' => 'datetime',
        ];
    }

    // ─── Append-only enforcement ──────────────────────────────────────────────

    public function delete(): bool|null
    {
        throw new \LogicException('Audit logs are append-only and cannot be deleted.');
    }

    public function forceDelete(): bool|null
    {
        throw new \LogicException('Audit logs are append-only and cannot be deleted.');
    }

    // ─── Relationships ────────────────────────────────────────────────────────

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
