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

// Public routes — intentionally unauthenticated
Route::prefix('v1')->middleware(['throttle:api'])->group(
    base_path('routes/api/public.php')
);

// User API routes — token must carry the 'user' ability
Route::prefix('v1')->middleware(['auth:sanctum', 'abilities:user', 'throttle:api'])->group(
    base_path('routes/api/v1.php')
);

// Admin public routes (login only) — intentionally unauthenticated
Route::prefix('admin/v1')->middleware(['throttle:auth'])->group(
    base_path('routes/api/admin_public.php')
);

// Admin authenticated routes — token must carry the 'admin' ability; admin.auth asserts is_admin
Route::prefix('admin/v1')->middleware(['auth:sanctum', 'abilities:admin', 'admin.auth', 'throttle:admin'])->group(
    base_path('routes/api/admin_v1.php')
);

// Stripe webhook — no auth:sanctum; Stripe-Signature header IS the authentication.
// intentionally public
Route::post('/webhook/stripe', [StripeWebhookController::class, 'handle'])
    ->middleware('throttle:60,1');
