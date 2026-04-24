<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Principle: SRP — HTTP only; delegates all logic to NotificationService.
 * Principle: Security — every query is scoped to the authenticated user; no cross-user access.
 */
class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $notifications,
    ) {}

    /** GET /api/v1/notifications — last 10, max 7 days old */
    public function index(Request $request): JsonResponse
    {
        $result = $this->notifications->listForUser($request->user());

        return response()->json([
            'data' => NotificationResource::collection($result['notifications']),
            'meta' => ['unread_count' => $result['unread_count']],
        ]);
    }

    /** PATCH /api/v1/notifications/{id}/read — mark a single notification as read */
    public function markOneRead(Request $request, string $id): Response
    {
        $this->notifications->markOneRead($request->user(), $id);

        return response()->noContent();
    }

    /** PUT /api/v1/notifications/read-all — mark every unread notification as read */
    public function markAllRead(Request $request): Response
    {
        $this->notifications->markAllRead($request->user());

        return response()->noContent();
    }

    /** DELETE /api/v1/notifications/{id} — delete a single notification */
    public function destroy(Request $request, string $id): Response
    {
        $this->notifications->deleteOne($request->user(), $id);

        return response()->noContent();
    }

    /** DELETE /api/v1/notifications — delete all notifications for the user */
    public function destroyAll(Request $request): Response
    {
        $this->notifications->deleteAll($request->user());

        return response()->noContent();
    }
}
