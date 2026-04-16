<?php

declare(strict_types=1);

use App\Exceptions\DomainException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin.auth' => \App\Http\Middleware\AdminAuthenticate::class,
            'abilities'  => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability'    => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (DomainException $e): JsonResponse {
            Log::error('Domain exception', ['code' => $e->getMessage(), 'status' => $e->getStatus()]);

            return response()->json([
                'message' => $e->getMessage(),
                'code'    => $e->getMessage(),
            ], $e->getStatus());
        });

        $exceptions->render(function (ValidationException $e): JsonResponse {
            return response()->json([
                'message' => 'The given data was invalid.',
                'code'    => 'validation_failed',
                'errors'  => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $e): JsonResponse {
            Log::error('Authentication exception', ['message' => $e->getMessage()]);

            return response()->json([
                'message' => 'Unauthenticated.',
                'code'    => 'unauthenticated',
            ], 401);
        });

        // Laravel's prepareException() converts AuthorizationException → HttpException(403)
        // and ModelNotFoundException → HttpException(404) before render callbacks fire.
        // The AuthorizationException callback type-hint would never match at that point.
        // This HttpException callback intercepts the converted exceptions with correct shapes.
        $exceptions->render(function (HttpException $e): ?JsonResponse {
            return match ($e->getStatusCode()) {
                403 => response()->json(['message' => 'Unauthorized.', 'code' => 'unauthorized'], 403),
                404 => response()->json(['message' => 'Not found.', 'code' => 'not_found'], 404),
                default => null, // fall through to Throwable handler
            };
        });

        $exceptions->render(function (\Throwable $e): ?JsonResponse {
            // HttpExceptions not handled above (e.g. 405, 429) fall through to
            // Laravel's built-in renderHttpException() which returns the correct status.
            if ($e instanceof HttpException) {
                return null;
            }

            Log::error('Unhandled exception', [
                'class'   => get_class($e),
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'An unexpected error occurred.',
                'code'    => 'internal',
            ], 500);
        });

    })->create();
