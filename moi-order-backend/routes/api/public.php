<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\HomeCardController;
use App\Http\Controllers\Api\V1\PlaceController;
use App\Http\Controllers\Api\V1\RestaurantBrowseController;
use App\Http\Controllers\Api\V1\ServiceCategoryController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\TicketController;
use Illuminate\Support\Facades\Route;

// intentionally public
Route::get('/health', fn () => response()->json(['status' => 'ok', 'version' => 'v1']));

// Auth — intentionally public, rate-limited by throttle:auth applied per route
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('/auth/login',    [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/google',   [AuthController::class, 'googleAuth']);
    Route::post('/auth/apple',    [AuthController::class, 'appleAuth']);
    Route::post('/auth/line',     [AuthController::class, 'lineAuth']);
    Route::post('/auth/otp/request', [AuthController::class, 'requestOtp']);
    Route::post('/auth/otp/verify',  [AuthController::class, 'verifyOtp']);
});

// Places — public browsing, no auth required
Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/{place}', [PlaceController::class, 'show']);

// Tags — public, used for map filter
Route::get('/tags', [TagController::class, 'index']);

// Services — public catalog (prices + types), no auth required
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/service-categories/{slug}', [ServiceCategoryController::class, 'show']);

// Tickets — public browsing, no auth required
Route::get('/tickets', [TicketController::class, 'index']);
Route::get('/tickets/{ticket}', [TicketController::class, 'show']);

// Restaurants — public browsing, no auth required
Route::get('/restaurants',      [RestaurantBrowseController::class, 'index']);
Route::get('/restaurants/{id}', [RestaurantBrowseController::class, 'show']);

// Home cards — public, no auth required (shown on home screen before login)
Route::get('/home-cards', [HomeCardController::class, 'index']);
