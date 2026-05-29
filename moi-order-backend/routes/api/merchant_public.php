<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Merchant\V1\MerchantAuthController;
use App\Http\Controllers\Api\Merchant\V1\MerchantEmailAuthController;
use Illuminate\Support\Facades\Route;

// intentionally public — credentials are the authorisation
Route::post('/auth/login',      [MerchantAuthController::class, 'login']);
Route::post('/auth/otp/request',[MerchantAuthController::class, 'otpRequest']);
Route::post('/auth/otp/verify', [MerchantAuthController::class, 'otpVerify']);

// Email-OTP registration — 3-step flow
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('/auth/email/send-otp',  [MerchantEmailAuthController::class, 'sendOtp']);
    Route::post('/auth/email/verify-otp',[MerchantEmailAuthController::class, 'verifyOtp']);
    Route::post('/auth/email/register',  [MerchantEmailAuthController::class, 'completeRegistration']);
});
