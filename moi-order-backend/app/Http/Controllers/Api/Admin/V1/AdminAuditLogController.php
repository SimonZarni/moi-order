<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminAuditLogIndexRequest;
use App\Http\Resources\Admin\AdminAuditLogResource;
use App\Services\AuditLogService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Principle: SRP — HTTP layer only. Read-only: index + export. No mutation actions.
 */
class AdminAuditLogController extends Controller
{
    public function __construct(private readonly AuditLogService $service) {}

    /** GET /api/admin/v1/audit-logs */
    public function index(AdminAuditLogIndexRequest $request): AnonymousResourceCollection
    {
        return AdminAuditLogResource::collection($this->service->index($request));
    }

    /** GET /api/admin/v1/audit-logs/export */
    public function export(AdminAuditLogIndexRequest $request): StreamedResponse
    {
        return $this->service->export($request);
    }
}
