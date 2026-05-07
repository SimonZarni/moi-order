<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\AdminRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $roleId = $request->user()?->admin_role_id;

        if (! $roleId) {
            return response()->json(['message' => 'Unauthorized.', 'code' => 'unauthorized'], 403);
        }

        $role = AdminRole::find($roleId);

        if ($role?->slug !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized.', 'code' => 'unauthorized'], 403);
        }

        return $next($request);
    }
}
