<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Exceptions\DomainException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRolePermissionsRequest;
use App\Http\Resources\Admin\AdminRoleResource;
use App\Http\Resources\Admin\PermissionResource;
use App\Models\AdminRole;
use App\Models\Permission;
use App\Services\AdminRoleService;
use Illuminate\Http\JsonResponse;

class AdminRoleController extends Controller
{
    public function __construct(private readonly AdminRoleService $service) {}

    public function index(): JsonResponse
    {
        $roles       = AdminRole::with('permissions')->get();
        $permissions = Permission::orderBy('group')->orderBy('key')->get();

        return response()->json([
            'data' => [
                'roles'       => AdminRoleResource::collection($roles),
                'permissions' => PermissionResource::collection($permissions),
            ],
        ]);
    }

    public function update(UpdateRolePermissionsRequest $request, AdminRole $role): JsonResponse
    {
        if ($role->slug === 'super_admin') {
            throw new DomainException('roles.super_admin_immutable', 403);
        }

        $this->service->updatePermissions($role, $request->validated('permission_keys'));

        return response()->json(['message' => 'Permissions updated.']);
    }
}
