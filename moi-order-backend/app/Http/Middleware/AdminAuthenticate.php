<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Principle: SRP — sole responsibility is asserting the authenticated user is an admin.
 *   Authentication (token validity) is already handled upstream by auth:sanctum.
 *   This middleware only handles authorisation (role gate).
 *
 * Principle: Security — Defence in depth: middleware → Policy → ServiceRule → DBConstraint.
 *   Non-admin authenticated users receive 403, not 401, because they ARE authenticated.
 */
class AdminAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isAdmin()) {
            throw new AuthorizationException('Admin access required.');
        }

        return $next($request);
    }
}
