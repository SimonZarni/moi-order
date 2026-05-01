<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\AdminRole;
use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * Principle: SRP — sole responsibility is asserting the admin has a specific permission key.
 *   Runs after auth:sanctum + admin.auth; those middlewares already assert the user is an admin.
 *
 * Caches per admin_role_id so all admins sharing a role benefit from a single warm cache entry.
 * Super admin slug bypass avoids a cache/DB hit entirely once the role is cached.
 */
class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user   = $request->user();
        $roleId = $user?->admin_role_id;

        if (! $roleId) {
            throw new AuthorizationException('No admin role assigned.');
        }

        $cacheKey = "admin_permissions:{$roleId}";

        /** @var array{slug:string,keys:list<string>} $data */
        $data = Cache::remember($cacheKey, now()->addHour(), function () use ($roleId): array {
            $role = AdminRole::with('permissions')->find($roleId);

            return [
                'slug' => $role?->slug ?? '',
                'keys' => $role?->permissions->pluck('key')->all() ?? [],
            ];
        });

        if ($data['slug'] === 'super_admin') {
            return $next($request);
        }

        if (! in_array($permission, $data['keys'], true)) {
            throw new AuthorizationException('Insufficient permissions.');
        }

        return $next($request);
    }
}
