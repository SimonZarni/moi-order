<?php

declare(strict_types=1);

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

// User API routes
Route::prefix('v1')->middleware(['auth:sanctum', 'throttle:api'])->group(
    base_path('routes/api/v1.php')
);

// Admin API routes
Route::prefix('admin/v1')->middleware(['auth:sanctum', 'throttle:admin'])->group(
    base_path('routes/api/admin_v1.php')
);
