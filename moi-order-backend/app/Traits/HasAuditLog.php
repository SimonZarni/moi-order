<?php

declare(strict_types=1);

namespace App\Traits;

use App\Contracts\AuditLogInterface;
use App\Enums\AuditAction;
use Illuminate\Support\Arr;

/**
 * Principle: SRP — one concern: register Eloquent audit listeners on the model.
 * Principle: OCP — new entity types add this trait; zero changes to AuditLogService.
 *
 * Sensitive fields are stripped before the service is called so the service
 * never receives raw passwords or payment secrets regardless of call site.
 *
 * Guard: if no admin is authenticated (queue job, artisan, seeder), the service
 * skips the write silently. No need to guard here — the service handles it.
 */
trait HasAuditLog
{
    private static array $globalAuditExclude = [
        'password',
        'remember_token',
        'two_factor_secret',
        'stripe_payload',
        'idempotency_key',
        'updated_at',
        'deleted_at',
    ];

    public static function bootHasAuditLog(): void
    {
        static::created(function (self $model): void {
            $excluded  = array_merge(static::$globalAuditExclude, $model->auditExcludedFields());
            $newValues = Arr::except(
                $model->getAttributes(),
                array_merge($excluded, ['id', 'created_at'])
            );

            app(AuditLogInterface::class)->record(AuditAction::Created, $model, null, $newValues);
        });

        static::updated(function (self $model): void {
            $excluded = array_merge(static::$globalAuditExclude, $model->auditExcludedFields());
            $changed  = array_diff(array_keys($model->getChanges()), $excluded);

            if (empty($changed)) {
                return;
            }

            $before = Arr::only($model->getOriginal(), $changed);
            $after  = Arr::only($model->getChanges(),  $changed);

            app(AuditLogInterface::class)->record(AuditAction::Updated, $model, $before, $after);
        });

        static::deleted(function (self $model): void {
            app(AuditLogInterface::class)->record(AuditAction::Deleted, $model, null, null);
        });

        static::restored(function (self $model): void {
            app(AuditLogInterface::class)->record(AuditAction::Restored, $model, null, null);
        });
    }

    // ─── Override per model ───────────────────────────────────────────────────

    /** Fields that must never appear in audit diffs for this model. */
    public function auditExcludedFields(): array
    {
        return [];
    }

    /** Human-readable entity type label, e.g. 'user', 'payment'. */
    public function getAuditEntityType(): string
    {
        return strtolower(class_basename(static::class));
    }

    /** Human-readable display name for the entity snapshot. */
    public function getAuditLabel(): string
    {
        return (string) ($this->name ?? $this->name_en ?? $this->uuid ?? $this->id);
    }
}
