<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Exceptions\DomainException;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Principle: Defence in depth — status is enforced on every authenticated request,
 * not only at login. Token revocation on suspend/ban is the first layer; this middleware
 * is the second layer, catching tokens issued before restriction was applied.
 */
class CheckUserNotSuspended
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user !== null && $user->isRestricted()) {
            $code    = $user->status->value === 'banned' ? 'account.banned' : 'account.suspended';
            $context = $user->suspended_until !== null
                ? ['suspended_until' => $user->suspended_until->toISOString()]
                : [];
            throw new DomainException($code, 403, $context);
        }

        return $next($request);
    }
}
