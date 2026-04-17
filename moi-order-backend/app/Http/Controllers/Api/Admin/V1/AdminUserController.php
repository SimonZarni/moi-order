<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminCreateUserDTO;
use App\DTOs\AdminUpdateUserDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreUserRequest;
use App\Http\Requests\Admin\AdminUpdateUserRequest;
use App\Http\Requests\Admin\AdminUserIndexRequest;
use App\Http\Resources\Admin\AdminUserResource;
use App\Models\User;
use App\Services\AdminUserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class AdminUserController extends Controller
{
    public function __construct(private readonly AdminUserService $service) {}

    /** GET /api/admin/v1/users */
    public function index(AdminUserIndexRequest $request): AnonymousResourceCollection
    {
        return AdminUserResource::collection($this->service->index($request));
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
        return response()->json(['data' => new AdminUserResource($this->service->show($user))]);
    }

    /** PUT /api/admin/v1/users/{user} */
    public function update(AdminUpdateUserRequest $request, User $user): JsonResponse
    {
        $updated = $this->service->update($user, AdminUpdateUserDTO::fromRequest($request));

        return response()->json(['data' => new AdminUserResource($updated)]);
    }

    /** DELETE /api/admin/v1/users/{user} */
    public function destroy(User $user): JsonResponse
    {
        $this->service->destroy($user);

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
}
