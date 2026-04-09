<?php

declare(strict_types=1);

use App\Exceptions\DomainException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
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

        $exceptions->render(function (AuthorizationException $e): JsonResponse {
            Log::error('Authorization exception', ['message' => $e->getMessage()]);

            return response()->json([
                'message' => 'Unauthorized.',
                'code'    => 'unauthorized',
            ], 403);
        });

    })->create();
