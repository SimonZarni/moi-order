<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyHmacSignature
{
    private const MAX_AGE_SECONDS = 30;

    public function handle(Request $request, Closure $next): Response
    {
        $timestamp = $request->header('X-Timestamp');
        $signature = $request->header('X-Signature');

        if ($timestamp === null || $signature === null) {
            return response()->json([
                'message' => 'Missing signature.',
                'code'    => 'signature.missing',
            ], 401);
        }

        if (abs(now()->timestamp - (int) $timestamp) > self::MAX_AGE_SECONDS) {
            return response()->json([
                'message' => 'Request expired.',
                'code'    => 'signature.expired',
            ], 401);
        }

        $payload  = $timestamp
            . strtoupper($request->method())
            . $request->getRequestUri()
            . $request->getContent();

        $expected = hash_hmac('sha256', $payload, (string) config('app.hmac_secret'));

        if (! hash_equals($expected, strtolower((string) $signature))) {
            return response()->json([
                'message' => 'Invalid signature.',
                'code'    => 'signature.invalid',
            ], 401);
        }

        return $next($request);
    }
}
