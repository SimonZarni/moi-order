<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * Updates last_active_at on authenticated user requests.
 * Throttled to one DB write per user per 5 minutes via cache to avoid hot-row contention.
 */
class UpdateLastActive
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user instanceof User) {
            $key = "last_active:{$user->id}";

            if (! Cache::has($key)) {
                Cache::put($key, true, now()->addMinutes(5));
                $user->timestamps = false;
                $user->update(['last_active_at' => now()]);
                $user->timestamps = true;
            }
        }

        return $next($request);
    }
}
