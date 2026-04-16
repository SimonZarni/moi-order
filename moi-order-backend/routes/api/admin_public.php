<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\V1\AdminAuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Public Routes — no authentication required
|--------------------------------------------------------------------------
*/

// intentionally public — admin login endpoint
Route::post('/auth/login', [AdminAuthController::class, 'login'])->name('admin.auth.login');
