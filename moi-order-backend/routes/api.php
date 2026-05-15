<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Webhook\StripeWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Three groups:
|   1. Public  — /api/v1      throttle:auth  (no authentication required)
|   2. User    — /api/v1      auth:sanctum   throttle:api
|   3. Admin   — /api/admin/v1 auth:sanctum  throttle:admin
*/

// Health check — intentionally public, no throttle, excluded from maintenance mode in bootstrap/app.php
Route::get('/health', static function () {
    return response()->json(['status' => 'ok', 'time' => now()->toIso8601String()]);
});

// Public routes — intentionally unauthenticated
Route::prefix('v1')->middleware(['hmac.verify', 'throttle:api'])->group(
    base_path('routes/api/public.php')
);

// User API routes — token must carry the 'user' ability; status checked on every request
Route::prefix('v1')->middleware(['hmac.verify', 'auth:sanctum', 'abilities:user', 'user.not_suspended', 'update.last_active', 'throttle:api'])->group(
    base_path('routes/api/v1.php')
);

// Admin public routes (login only) — intentionally unauthenticated
// hmac.verify excluded: admin dashboard is a browser app and cannot compute HMAC headers.
// Admin routes are secured by httpOnly cookie + abilities:admin + AdminAuthenticate.
Route::prefix('admin/v1')->middleware(['throttle:auth'])->group(
    base_path('routes/api/admin_public.php')
);

// Admin authenticated routes — token must carry the 'admin' ability; admin.auth asserts is_admin.
// admin.token.cookie must be listed before auth:sanctum so the httpOnly cookie is converted
// to a Bearer header before Sanctum attempts authentication.
Route::prefix('admin/v1')->middleware(['admin.token.cookie', 'auth:sanctum', 'abilities:admin', 'admin.auth', 'throttle:admin'])->group(
    base_path('routes/api/admin_v1.php')
);

// Merchant public routes (login only) — intentionally unauthenticated
Route::prefix('merchant/v1')->middleware(['hmac.verify', 'throttle:auth'])->group(
    base_path('routes/api/merchant_public.php')
);

// Merchant KYC routes — token with 'merchant' ability; no is_merchant gate (KYC is how they earn it)
Route::prefix('merchant/v1')->middleware(['hmac.verify', 'auth:sanctum', 'abilities:merchant', 'user.not_suspended', 'throttle:api'])->group(
    base_path('routes/api/merchant_kyc.php')
);

// Merchant authenticated routes — token must carry the 'merchant' ability; merchant.auth asserts is_merchant
Route::prefix('merchant/v1')->middleware(['hmac.verify', 'auth:sanctum', 'abilities:merchant', 'merchant.auth', 'user.not_suspended', 'throttle:api'])->group(
    base_path('routes/api/merchant_v1.php')
);

// Stripe webhook — no auth:sanctum; Stripe-Signature header IS the authentication.
// intentionally public
Route::post('/webhook/stripe', [StripeWebhookController::class, 'handle'])
    ->middleware('throttle:60,1');
