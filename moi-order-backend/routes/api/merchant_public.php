<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Merchant\V1\MerchantAuthController;
use Illuminate\Support\Facades\Route;

// intentionally public — credentials are the authorisation
Route::post('/auth/login', [MerchantAuthController::class, 'login']);
