<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminNotificationResource;
use App\Services\AdminNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Principle: SRP — HTTP only; delegates all logic to AdminNotificationService.
 * Principle: Security — every query is scoped to the authenticated admin; no cross-user access.
 */
class AdminNotificationController extends Controller
{
    public function __construct(
        private readonly AdminNotificationService $notifications,
    ) {}

    /** GET /api/admin/v1/notifications — bell dropdown: last 20, max 7 days */
    public function index(Request $request): JsonResponse
    {
        $result = $this->notifications->listForAdmin($request->user());

        return response()->json([
            'data' => AdminNotificationResource::collection($result['notifications']),
            'meta' => ['unread_count' => $result['unread_count']],
        ]);
    }

    /** GET /api/admin/v1/notifications/all — full paginated list with optional type filter */
    public function all(Request $request): JsonResponse
    {
        $request->validate([
            'type'     => ['nullable', 'string', 'in:new_submission,new_ticket_order,new_payment'],
            'page'     => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $result = $this->notifications->paginateForAdmin(
            admin:   $request->user(),
            page:    (int) $request->query('page', '1'),
            perPage: (int) $request->query('per_page', '20'),
            type:    $request->query('type'),
        );

        $paginator = $result['notifications'];

        return response()->json([
            'data' => AdminNotificationResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
                'unread_count' => $result['unread_count'],
            ],
        ]);
    }

    /** PATCH /api/admin/v1/notifications/{id}/read — mark a single notification as read */
    public function markOneRead(Request $request, string $id): Response
    {
        $this->notifications->markOneRead($request->user(), $id);

        return response()->noContent();
    }

    /** PUT /api/admin/v1/notifications/read-all — mark every unread notification as read */
    public function markAllRead(Request $request): Response
    {
        $this->notifications->markAllRead($request->user());

        return response()->noContent();
    }

    /** DELETE /api/admin/v1/notifications/{id} — delete a single notification */
    public function destroy(Request $request, string $id): Response
    {
        $this->notifications->deleteOne($request->user(), $id);

        return response()->noContent();
    }

    /** DELETE /api/admin/v1/notifications — delete all notifications for the admin */
    public function destroyAll(Request $request): Response
    {
        $this->notifications->deleteAll($request->user());

        return response()->noContent();
    }
}
