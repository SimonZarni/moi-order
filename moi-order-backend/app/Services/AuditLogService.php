<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\AuditLogInterface;
use App\Enums\AuditAction;
use App\Http\Requests\Admin\AdminAuditLogIndexRequest;
use App\Models\AdminAuditLog;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Principle: SRP — owns audit write + admin query/export logic only.
 * Principle: DIP — implements AuditLogInterface; bound in AppServiceProvider.
 * Security: audit failures are swallowed via try/catch so they never abort
 *   the primary operation that triggered them.
 */
class AuditLogService implements AuditLogInterface
{
    public function record(
        AuditAction $action,
        ?Model $entity = null,
        ?array $oldValues = null,
        ?array $newValues = null,
    ): void {
        $admin = auth()->user();

        if (! ($admin instanceof User)) {
            return; // No admin context: queue job, artisan command, seeder, etc.
        }

        $this->write($admin, $action, $entity, $oldValues, $newValues);
    }

    public function recordAs(
        User $admin,
        AuditAction $action,
        ?Model $entity = null,
    ): void {
        $this->write($admin, $action, $entity, null, null);
    }

    // ─── Query (admin list endpoint) ─────────────────────────────────────────

    public function index(AdminAuditLogIndexRequest $request): LengthAwarePaginator
    {
        $query = AdminAuditLog::latest('created_at');

        if ($request->filled('admin_id')) {
            $query->where('admin_id', $request->integer('admin_id'));
        }

        if ($request->filled('action')) {
            $query->where('action', $request->string('action')->toString());
        }

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->string('entity_type')->toString());
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from')->toString());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(static function ($q) use ($search): void {
                $q->where('admin_name',  'like', "%{$search}%")
                  ->orWhere('admin_email',  'like', "%{$search}%")
                  ->orWhere('entity_label', 'like', "%{$search}%");
            });
        }

        return $query->paginate($request->integer('per_page', 20));
    }

    public function export(AdminAuditLogIndexRequest $request): StreamedResponse
    {
        $query = AdminAuditLog::latest('created_at');

        if ($request->filled('admin_id')) {
            $query->where('admin_id', $request->integer('admin_id'));
        }

        if ($request->filled('action')) {
            $query->where('action', $request->string('action')->toString());
        }

        if ($request->filled('entity_type')) {
            $query->where('entity_type', $request->string('entity_type')->toString());
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from')->toString());
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to')->toString());
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(static function ($q) use ($search): void {
                $q->where('admin_name',  'like', "%{$search}%")
                  ->orWhere('admin_email',  'like', "%{$search}%")
                  ->orWhere('entity_label', 'like', "%{$search}%");
            });
        }

        $filename = 'audit-log-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($query): void {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, ['Timestamp', 'Admin Name', 'Admin Email', 'Action', 'Entity Type', 'Entity Label', 'IP Address']);

            $query->chunk(500, function ($rows) use ($handle): void {
                foreach ($rows as $row) {
                    fputcsv($handle, [
                        $row->created_at->toISOString(),
                        $row->admin_name,
                        $row->admin_email,
                        $row->action->label(),
                        $row->entity_type ?? '',
                        $row->entity_label ?? '',
                        $row->ip_address ?? '',
                    ]);
                }
            });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private function write(
        User $admin,
        AuditAction $action,
        ?Model $entity,
        ?array $oldValues,
        ?array $newValues,
    ): void {
        try {
            AdminAuditLog::create([
                'admin_id'     => $admin->id,
                'admin_name'   => $admin->name,
                'admin_email'  => $admin->email,
                'action'       => $action->value,
                'entity_type'  => $entity ? $this->entityType($entity) : null,
                'entity_id'    => $entity ? $this->entityId($entity)   : null,
                'entity_label' => $entity ? $this->entityLabel($entity) : null,
                'old_values'   => $oldValues,
                'new_values'   => $newValues,
                'ip_address'   => request()->ip(),
                'user_agent'   => mb_substr(request()->userAgent() ?? '', 0, 500),
            ]);
        } catch (\Throwable $e) {
            // Audit failures must never abort the primary operation.
            Log::error('audit_log.write_failed', [
                'action' => $action->value,
                'error'  => $e->getMessage(),
            ]);
        }
    }

    private function entityType(Model $entity): string
    {
        if (method_exists($entity, 'getAuditEntityType')) {
            return $entity->getAuditEntityType();
        }

        return strtolower(class_basename($entity));
    }

    private function entityId(Model $entity): string
    {
        return (string) (property_exists($entity, 'uuid') ? ($entity->uuid ?? $entity->id) : $entity->id);
    }

    private function entityLabel(Model $entity): string
    {
        if (method_exists($entity, 'getAuditLabel')) {
            return $entity->getAuditLabel();
        }

        return (string) ($entity->name ?? $entity->uuid ?? $entity->id);
    }
}
