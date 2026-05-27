<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\UserActivityLogInterface;
use App\DTOs\AdminCreateUserDTO;
use App\DTOs\AdminUpdateUserDTO;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUpdateUserRoleRequest;
use App\Http\Requests\Admin\AdminStoreUserRequest;
use App\Http\Requests\Admin\AdminSuspendUserRequest;
use App\Http\Requests\Admin\AdminUpdateUserRequest;
use App\Http\Requests\Admin\AdminUserIndexRequest;
use Carbon\Carbon;
use App\Http\Resources\Admin\AdminUserResource;
use App\Http\Resources\Admin\AdminUserDetailResource;
use App\Http\Resources\Admin\UserActivityLogResource;
use App\Models\User;
use App\Services\AdminUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class AdminUserController extends Controller
{
    public function __construct(
        private readonly AdminUserService        $service,
        private readonly UserActivityLogInterface $activityLog,
    ) {}

    /** GET /api/admin/v1/users */
    public function index(AdminUserIndexRequest $request): AnonymousResourceCollection
    {
        return AdminUserResource::collection($this->service->index($request));
    }

    /** GET /api/admin/v1/users/export */
    public function export(AdminUserIndexRequest $request): BinaryFileResponse
    {
        return $this->service->export($request);
    }

    /** POST /api/admin/v1/users */
    public function store(AdminStoreUserRequest $request): JsonResponse
    {
        $user = $this->service->store(AdminCreateUserDTO::fromRequest($request));

        return response()->json(['data' => new AdminUserResource($user)], 201);
    }

    /** GET /api/admin/v1/users/{user} */
    public function show(User $user): JsonResponse
    {
        return response()->json(['data' => new AdminUserDetailResource($this->service->show($user))]);
    }

    /** PUT /api/admin/v1/users/{user} */
    public function update(AdminUpdateUserRequest $request, User $user): JsonResponse
    {
        $updated = $this->service->update($user, AdminUpdateUserDTO::fromRequest($request));

        return response()->json(['data' => new AdminUserResource($updated)]);
    }

    /** DELETE /api/admin/v1/users/{user} */
    public function destroy(User $user, Request $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $this->service->destroy($user, $actor);

        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/users/{id}/restore */
    public function restore(int $id): JsonResponse
    {
        $user = $this->service->restore($id);

        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /** PATCH /api/admin/v1/users/{user}/toggle-admin */
    public function toggleAdmin(User $user): JsonResponse
    {
        $user = $this->service->toggleAdmin($user);

        return response()->json(['data' => new AdminUserResource($user)]);
    }

    /** PATCH /api/admin/v1/users/{user}/suspend */
    public function suspend(AdminSuspendUserRequest $request, User $user): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $until = $request->filled('suspended_until')
            ? Carbon::parse($request->string('suspended_until')->toString())
            : null;
        $updated = $this->service->suspend($user, $actor, $until);

        return response()->json(['data' => new AdminUserResource($updated)]);
    }

    /** PATCH /api/admin/v1/users/{user}/ban */
    public function ban(User $user, Request $request): JsonResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $updated = $this->service->ban($user, $actor);

        return response()->json(['data' => new AdminUserResource($updated)]);
    }

    /** PATCH /api/admin/v1/users/{user}/activate */
    public function activate(User $user): JsonResponse
    {
        $updated = $this->service->activate($user);

        return response()->json(['data' => new AdminUserResource($updated)]);
    }

    /** PATCH /api/admin/v1/users/{user}/role */
    public function updateRole(AdminUpdateUserRoleRequest $request, User $user): JsonResponse
    {
        $user->grantRole(UserRole::from($request->string('role')->toString()));

        return response()->json(['data' => new AdminUserResource($user->fresh())]);
    }

    /** GET /api/admin/v1/users/{user}/activity-log */
    public function activityLog(Request $request, User $user): AnonymousResourceCollection
    {
        $logs = $this->activityLog->forUser($user, $request->integer('per_page', 50));

        return UserActivityLogResource::collection($logs);
    }
}
