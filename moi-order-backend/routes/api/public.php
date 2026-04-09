<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PlaceController;
use App\Http\Controllers\Api\V1\ServiceController;
use Illuminate\Support\Facades\Route;

// intentionally public
Route::get('/health', fn () => response()->json(['status' => 'ok', 'version' => 'v1']));

// Auth — intentionally public, rate-limited by throttle:auth applied per route
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('/auth/login',    [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
});

// Places — public browsing, no auth required
Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{place}', [PlaceController::class, 'show']);

// Services — public catalog (prices + types), no auth required
Route::get('/services', [ServiceController::class, 'index']);
