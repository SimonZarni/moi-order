<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Merchant\V1\MerchantAuthController;
use App\Http\Controllers\Api\Merchant\V1\MerchantEmailAuthController;
use App\Http\Controllers\Api\Merchant\V1\MerchantSocialAuthController;
use Illuminate\Support\Facades\Route;

// intentionally public — credentials are the authorisation
Route::post('/auth/login',      [MerchantAuthController::class, 'login']);
Route::post('/auth/otp/request',[MerchantAuthController::class, 'otpRequest']);
Route::post('/auth/otp/verify', [MerchantAuthController::class, 'otpVerify']);

// Social auth — provider token is the credential
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('/auth/google',    [MerchantSocialAuthController::class, 'google']);
    Route::post('/auth/apple',     [MerchantSocialAuthController::class, 'apple']);
    Route::post('/auth/line',      [MerchantSocialAuthController::class, 'line']);
    Route::post('/auth/line/web',  [MerchantSocialAuthController::class, 'lineWeb']);
});

// Email-OTP registration — 3-step flow
Route::middleware('throttle:auth')->group(function (): void {
    Route::post('/auth/email/send-otp',  [MerchantEmailAuthController::class, 'sendOtp']);
    Route::post('/auth/email/verify-otp',[MerchantEmailAuthController::class, 'verifyOtp']);
    Route::post('/auth/email/register',  [MerchantEmailAuthController::class, 'completeRegistration']);
});
