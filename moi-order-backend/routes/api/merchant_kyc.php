<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Merchant\V1\KycController;
use App\Http\Controllers\Api\Merchant\V1\MerchantAuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Merchant KYC Routes — requires auth:sanctum + abilities:merchant
| NOTE: merchant.auth (isMerchant check) is intentionally absent here.
|       KYC is the process by which a user earns the merchant role.
|       These routes are accessible to any holder of a 'merchant' ability
|       token — including applicants who have not yet been approved.
|--------------------------------------------------------------------------
*/

// ── Auth (accessible to any merchant-ability token, including pre-KYC) ────────
Route::post('/auth/logout', [MerchantAuthController::class, 'logout']);
Route::get('/auth/me',      [MerchantAuthController::class, 'me']);

Route::prefix('kyc')->group(function (): void {
    Route::get('/',           [KycController::class, 'show']);
    Route::post('/',          [KycController::class, 'upsert']);
    Route::post('/documents', [KycController::class, 'uploadDocument']);
    Route::post('/submit',    [KycController::class, 'submit']);
});
