<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\CustomNotificationDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\V1\SendCustomNotificationRequest;
use App\Http\Resources\Admin\AdminCustomNotificationResource;
use App\Models\CustomNotification;
use App\Services\CustomNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP only; delegates all logic to CustomNotificationService.
 * Principle: Security — routes are inside the auth:sanctum + admin.auth middleware group.
 */
class AdminCustomNotificationController extends Controller
{
    public function __construct(
        private readonly CustomNotificationService $service,
    ) {}

    /** GET /api/admin/v1/custom-notifications — paginated send history, newest first */
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->query('per_page', 20)), 100);

        $records = CustomNotification::with(['targetUser', 'createdBy'])
            ->latest('sent_at')
            ->paginate($perPage);

        return AdminCustomNotificationResource::collection($records)
            ->response();
    }

    /** POST /api/admin/v1/custom-notifications — compose and send a custom notification */
    public function store(SendCustomNotificationRequest $request): JsonResponse
    {
        $dto    = CustomNotificationDTO::fromRequest($request);
        $record = $this->service->send($dto, $request->user());

        return response()->json(
            new AdminCustomNotificationResource($record->load(['targetUser', 'createdBy'])),
            201
        );
    }
}
