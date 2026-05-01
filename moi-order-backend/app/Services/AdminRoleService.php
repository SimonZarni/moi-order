<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AdminRole;
use App\Models\Permission;
use Illuminate\Support\Facades\Cache;

class AdminRoleService
{
    /**
     * Sync a role's permissions and invalidate its cache entry.
     *
     * @param list<string> $permissionKeys
     */
    public function updatePermissions(AdminRole $role, array $permissionKeys): void
    {
        $ids = Permission::whereIn('key', $permissionKeys)->pluck('id');
        $role->permissions()->sync($ids);
        Cache::forget("admin_permissions:{$role->id}");
    }
}
