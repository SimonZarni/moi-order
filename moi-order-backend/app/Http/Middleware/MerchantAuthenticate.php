<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Principle: SRP — asserts the authenticated token-holder is a merchant.
 *   auth:sanctum + abilities:merchant run first; this only asserts the role flag.
 * Principle: Security — Defence in depth: middleware → Policy → ServiceRule → DBConstraint.
 */
class MerchantAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isMerchant()) {
            throw new AuthorizationException('Merchant access required.');
        }

        return $next($request);
    }
}
