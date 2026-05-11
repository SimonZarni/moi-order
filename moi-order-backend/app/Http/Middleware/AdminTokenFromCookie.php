<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Reads the admin_token httpOnly cookie and injects it as a Bearer Authorization header
 * so the downstream auth:sanctum guard can validate it without the token ever touching
 * client-side JavaScript storage.
 *
 * Only injects when no Authorization header is already present — allows automated
 * scripts and Postman to still pass a Bearer token directly.
 */
class AdminTokenFromCookie
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('admin_token');

        if ($token && ! $request->hasHeader('Authorization')) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
