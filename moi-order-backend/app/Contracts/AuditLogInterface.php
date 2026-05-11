<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\AuditAction;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Principle: ISP — audit logging only; not mixed with reporting or querying.
 * Principle: DIP — callers depend on this abstraction, not AuditLogService directly.
 */
interface AuditLogInterface
{
    /**
     * Log an action by the currently authenticated admin.
     * Safe to call from Eloquent traits: if no admin is in the guard, the
     * implementation silently skips the write without throwing.
     */
    public function record(
        AuditAction $action,
        ?Model $entity = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void;

    /**
     * Log an action on behalf of a specific admin.
     * Used for login/logout where the guard is not yet set or already cleared.
     */
    public function recordAs(
        User $admin,
        AuditAction $action,
        ?Model $entity = null,
    ): void;
}
