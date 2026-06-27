<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AppConfigController;
use App\Http\Controllers\Api\V1\Auth\EmailAuthController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\EmergencyContactController;
use App\Http\Controllers\Api\V1\GooglePlacesController;
use App\Http\Controllers\Api\V1\HomeCardController;
use App\Http\Controllers\Api\V1\PlaceController;
use App\Http\Controllers\Api\V1\RestaurantBrowseController;
use App\Http\Controllers\Api\V1\RestaurantReviewController;
use App\Http\Controllers\Api\V1\ServiceCategoryController;
use App\Http\Controllers\Api\V1\ServiceController;
use App\Http\Controllers\Api\V1\TagController;
use App\Http\Controllers\Api\V1\SafetyLocationController;
use App\Http\Controllers\Api\V1\TicketController;
use Illuminate\Support\Facades\Route;

// intentionally public
Route::get('/health', fn () => response()->json(['status' => 'ok', 'version' => 'v1']));

// Named 'login' route required by Laravel's auth middleware when a request without
// Accept: application/json hits a protected endpoint — without this, the framework
// tries to redirect to route('login') which throws a RouteNotFoundException → 500.
// This API-only app never redirects; returning 401 JSON is the correct behaviour.
Route::get('/login', fn () => response()->json([
    'message' => 'Unauthenticated.',
    'code'    => 'unauthenticated',
], 401))->name('login');

// Auth — intentionally public, rate-limited by throttle:auth applied per route
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('/auth/check-email', [AuthController::class, 'checkEmail']);
    Route::post('/auth/login',       [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/google',   [AuthController::class, 'googleAuth']);
    Route::post('/auth/apple',    [AuthController::class, 'appleAuth']);
    Route::post('/auth/line',     [AuthController::class, 'lineAuth']);
    Route::post('/auth/otp/request', [AuthController::class, 'requestOtp']);
    Route::post('/auth/otp/verify',  [AuthController::class, 'verifyOtp']);

    // Email OTP auth — registration + password reset
    Route::post('/auth/email/send-otp',       [EmailAuthController::class, 'sendOtp']);
    Route::post('/auth/email/verify-otp',     [EmailAuthController::class, 'verifyOtp']);
    Route::post('/auth/email/register',       [EmailAuthController::class, 'completeRegistration']);
    Route::post('/auth/email/reset-password', [EmailAuthController::class, 'resetPassword']);
});

// Google Places search proxy — intentionally public, no auth required
// Proxies requests to Google Places API so the API key never leaves the server.
Route::get('/google-places',                        [GooglePlacesController::class, 'search']);
Route::get('/google-places/{placeId}/location',     [GooglePlacesController::class, 'location']);

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
Route::get('/restaurants',              [RestaurantBrowseController::class, 'index']);
Route::get('/restaurants/{id}',         [RestaurantBrowseController::class, 'show']);
Route::get('/restaurants/{id}/reviews', [RestaurantReviewController::class, 'index']);

// Home cards — public, no auth required (shown on home screen before login)
Route::get('/home-cards', [HomeCardController::class, 'index']);

// Emergency contacts — public browsing, no auth required
Route::get('/emergency/contacts',          [EmergencyContactController::class, 'index']);
Route::get('/emergency/contacts/{contact}', [EmergencyContactController::class, 'show']);

// App config — intentionally public — called on every app launch to check update/alert status
Route::get('/app-config', [AppConfigController::class, 'index']);

// Safety locations — intentionally public — hospitals, police stations, rescue
Route::get('/safety-locations', [SafetyLocationController::class, 'index']);
Route::get('/safety-locations/{id}', [SafetyLocationController::class, 'show'])->whereNumber('id');
