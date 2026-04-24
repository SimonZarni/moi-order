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

    /** GET /api/admin/v1/notifications — last 20, max 7 days old */
    public function index(Request $request): JsonResponse
    {
        $result = $this->notifications->listForAdmin($request->user());

        return response()->json([
            'data' => AdminNotificationResource::collection($result['notifications']),
            'meta' => ['unread_count' => $result['unread_count']],
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
}
