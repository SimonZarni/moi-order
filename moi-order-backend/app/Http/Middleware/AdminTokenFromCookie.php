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
        // $_SERVER['HTTP_COOKIE'] is populated by Nginx via fastcgi_param HTTP_COOKIE $http_cookie
        // and is more reliable than $request->headers->get('Cookie') which Symfony may not expose.
        $cookieHeader = $_SERVER['HTTP_COOKIE'] ?? $request->headers->get('Cookie') ?? '';

        \Illuminate\Support\Facades\Log::error('AdminTokenFromCookie', [
            'running'             => true,
            'has_auth'            => $request->hasHeader('Authorization'),
            'cookie_from_server'  => $_SERVER['HTTP_COOKIE'] ?? null,
            'cookie_from_headers' => $request->headers->get('Cookie'),
            'cookie_used'         => $cookieHeader,
        ]);

        if (! $request->hasHeader('Authorization')) {
            $token = $this->parseCookieHeader($cookieHeader);

            if ($token !== null) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        return $next($request);
    }

    /**
     * Parse the raw Cookie header directly instead of using $request->cookie(),
     * which goes through the EncryptCookies middleware and returns null when the
     * cookie was written unencrypted (as it is on API routes).
     */
    private function parseCookieHeader(string $cookieHeader): ?string
    {
        foreach (explode(';', $cookieHeader) as $pair) {
            [$name, $value] = array_pad(explode('=', trim($pair), 2), 2, null);

            if (trim((string) $name) === 'admin_token' && $value !== null) {
                return urldecode(trim($value));
            }
        }

        return null;
    }
}
