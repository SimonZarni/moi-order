<?php

declare(strict_types=1);

use App\Exceptions\DomainException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $middleware->trustProxies(at: '*');

        // These paths respond normally even when the app is in maintenance mode.
        // /api/health — lets the mobile app poll for restoration.
        // /api/admin/v1/maintenance* — lets the admin toggle maintenance off without CLI access.
        $middleware->preventMaintenanceModeExclude([
            '/api/health',
            '/api/admin/v1/maintenance',
            '/api/admin/v1/maintenance/enable',
            '/api/admin/v1/maintenance/disable',
        ]);

        $middleware->alias([
            'admin.auth'          => \App\Http\Middleware\AdminAuthenticate::class,
            'check.permission'    => \App\Http\Middleware\CheckPermission::class,
            'merchant.auth'       => \App\Http\Middleware\MerchantAuthenticate::class,
            'user.not_suspended'  => \App\Http\Middleware\CheckUserNotSuspended::class,
            'ensure.super_admin'  => \App\Http\Middleware\EnsureSuperAdmin::class,
            'abilities'           => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
            'ability'             => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,
            'update.last_active'  => \App\Http\Middleware\UpdateLastActive::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        // This is a pure JSON API — never redirect to web login route.
        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e): bool {
            return true;
        });

        $exceptions->render(function (DomainException $e): JsonResponse {
            Log::error('Domain exception', ['code' => $e->getMessage(), 'status' => $e->getStatus()]);

            $body = ['message' => $e->getMessage(), 'code' => $e->getMessage()];

            // Only expose internal context in debug mode — never leak implementation
            // details (model IDs, query data, stack frames) to production clients.
            if (config('app.debug') && $e->getContext() !== []) {
                $body['context'] = $e->getContext();
            }

            return response()->json($body, $e->getStatus());
        });

        $exceptions->render(function (ValidationException $e): JsonResponse {
            return response()->json([
                'message' => 'The given data was invalid.',
                'code'    => 'validation_failed',
                'errors'  => $e->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $e): JsonResponse {
            Log::info('Authentication exception', ['message' => $e->getMessage()]);

            return response()->json([
                'message' => 'Unauthenticated.',
                'code'    => 'unauthenticated',
            ], 401);
        });

        // Catches ALL HttpException subclasses (including 405 MethodNotAllowed and
        // 429 ThrottleRequests) with a clean {message,code} shape.
        // Previously, unhandled status codes returned null here and fell through to
        // Laravel's built-in renderer which dumps the full stack trace when APP_DEBUG=true.
        $exceptions->render(function (HttpException $e): JsonResponse {
            return match ($e->getStatusCode()) {
                401 => response()->json(['message' => 'Unauthenticated.', 'code' => 'unauthenticated'], 401),
                403 => response()->json(['message' => 'Unauthorized.', 'code' => 'unauthorized'], 403),
                404 => response()->json(['message' => 'Not found.', 'code' => 'not_found'], 404),
                405 => response()->json(['message' => 'Method not allowed.', 'code' => 'method_not_allowed'], 405),
                429 => response()->json(['message' => 'Too many requests. Please try again later.', 'code' => 'too_many_requests'], 429),
                default => response()->json(['message' => 'An error occurred.', 'code' => 'http_error'], $e->getStatusCode()),
            };
        });

        $exceptions->render(function (\Throwable $e): JsonResponse {
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
