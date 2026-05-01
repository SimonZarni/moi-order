<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\AdminRole;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user   = $request->user();
        $roleId = $user?->admin_role_id;

        if (! $roleId) {
            throw new AuthorizationException('No admin role assigned.');
        }

        $role = AdminRole::with('permissions')->find($roleId);

        if (! $role) {
            throw new AuthorizationException('Admin role not found.');
        }

        if ($role->slug === 'super_admin') {
            return $next($request);
        }

        if (! $role->permissions->pluck('key')->contains($permission)) {
            throw new AuthorizationException('Insufficient permissions.');
        }

        return $next($request);
    }
}
