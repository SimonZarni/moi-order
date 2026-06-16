<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Merchant\V1\BusinessProfileController;
use App\Http\Controllers\Api\Merchant\V1\KycController;
use App\Http\Controllers\Api\Merchant\V1\MerchantProfileController;
use App\Http\Controllers\Api\V1\DeviceTokenController;
use App\Http\Controllers\Api\Merchant\V1\MerchantEmailVerificationController;
use App\Http\Controllers\Api\Merchant\V1\MerchantAnalyticsController;
use App\Http\Controllers\Api\Merchant\V1\MerchantNotificationController;
use App\Http\Controllers\Api\Merchant\V1\MerchantOrderChatController;
use App\Http\Controllers\Api\Merchant\V1\MerchantOrderController;
use App\Http\Controllers\Api\Merchant\V1\MerchantRestaurantController;
use App\Http\Controllers\Api\Merchant\V1\MenuCategoryController;
use App\Http\Controllers\Api\Merchant\V1\MenuItemController;
use App\Http\Controllers\Api\Merchant\V1\MerchantAlarmSettingController;
use App\Http\Controllers\Api\Merchant\V1\MerchantReviewController;
use Illuminate\Support\Facades\Route;

// ── Profile ───────────────────────────────────────────────────────────────────
Route::patch('/profile/password', [MerchantProfileController::class, 'changePassword']);

// ── Email verification (for admin-provisioned accounts) ───────────────────────
Route::post('/profile/verify-email/send',    [MerchantEmailVerificationController::class, 'send']);
Route::post('/profile/verify-email/confirm', [MerchantEmailVerificationController::class, 'confirm']);

// ── Business profile ─────────────────────────────────────────────────────────
Route::get('/business-profile',             [BusinessProfileController::class, 'show']);
Route::patch('/business-profile',           [BusinessProfileController::class, 'update']);
Route::post('/business-profile/documents',  [BusinessProfileController::class, 'uploadDocument']);

// ── Restaurant ────────────────────────────────────────────────────────────────
Route::get('/restaurant',          [MerchantRestaurantController::class, 'show']);
Route::post('/restaurant',         [MerchantRestaurantController::class, 'store']);
Route::put('/restaurant',          [MerchantRestaurantController::class, 'update']);
Route::patch('/restaurant',        [MerchantRestaurantController::class, 'update']);
Route::patch('/restaurant/status', [MerchantRestaurantController::class, 'updateStatus']);

// ── Menu categories ───────────────────────────────────────────────────────────
Route::get('/menu/categories',          [MenuCategoryController::class, 'index']);
Route::post('/menu/categories',         [MenuCategoryController::class, 'store']);
Route::put('/menu/categories/{id}',     [MenuCategoryController::class, 'update']);
Route::patch('/menu/categories/{id}',   [MenuCategoryController::class, 'update']);
Route::delete('/menu/categories/{id}',  [MenuCategoryController::class, 'destroy']);

// ── Menu items ────────────────────────────────────────────────────────────────
Route::post('/menu/categories/{categoryId}/items', [MenuItemController::class, 'store']);
Route::put('/menu/items/{id}',    [MenuItemController::class, 'update']);
Route::patch('/menu/items/{id}',  [MenuItemController::class, 'update']);
Route::delete('/menu/items/{id}', [MenuItemController::class, 'destroy']);

// ── Analytics ─────────────────────────────────────────────────────────────────
Route::get('/analytics',       [MerchantAnalyticsController::class, 'index']);
Route::get('/analytics/chart', [MerchantAnalyticsController::class, 'chart']);
Route::get('/analytics/tops',  [MerchantAnalyticsController::class, 'tops']);

// ── Orders ────────────────────────────────────────────────────────────────────
Route::get('/orders',                        [MerchantOrderController::class, 'index']);
Route::get('/orders/{id}',                   [MerchantOrderController::class, 'show']);
Route::post('/orders/{id}/confirm-payment',  [MerchantOrderController::class, 'confirmPayment']);
Route::put('/orders/{id}/status',            [MerchantOrderController::class, 'updateStatus']);
Route::patch('/orders/{id}/status',          [MerchantOrderController::class, 'updateStatus']);
Route::patch('/orders/{id}/items',           [MerchantOrderController::class, 'editItems']);

// ── Order chat ────────────────────────────────────────────────────────────────
Route::get('/orders/{id}/chat',        [MerchantOrderChatController::class, 'index']);
Route::post('/orders/{id}/chat',       [MerchantOrderChatController::class, 'store']);
Route::post('/orders/{id}/chat/read',            [MerchantOrderChatController::class, 'markRead']);
Route::delete('/orders/{id}/chat/{messageId}',   [MerchantOrderChatController::class, 'destroy']);

// ── In-app notifications ──────────────────────────────────────────────────────
Route::get('/notifications',                         [MerchantNotificationController::class, 'index']);
Route::get('/notifications/unread-count',            [MerchantNotificationController::class, 'unreadCount']);
Route::post('/notifications/read-all',               [MerchantNotificationController::class, 'markAllRead']);
Route::post('/notifications/read-by-order/{uuid}',   [MerchantNotificationController::class, 'readByOrder']);
Route::post('/notifications/{id}/read',              [MerchantNotificationController::class, 'markRead']);

// ── KYC resubmission (name/address change) ────────────────────────────────────
Route::post('/kyc/resubmit',                                  [KycController::class, 'resubmit']);
Route::post('/kyc/resubmit/{id}/documents',                   [KycController::class, 'uploadResubmitDocument']);
Route::post('/kyc/resubmit/{id}/use-existing-documents',      [KycController::class, 'useExistingDocuments']);
Route::post('/kyc/resubmit/{id}/submit',                      [KycController::class, 'submitResubmission']);

// ── Reviews ───────────────────────────────────────────────────────────────────
Route::get('/reviews', [MerchantReviewController::class, 'index']);

// ── Device tokens — push notification registration ────────────────────────────
Route::post('/device-tokens',   [DeviceTokenController::class, 'store']);
Route::delete('/device-tokens', [DeviceTokenController::class, 'destroy']);

// ── Restaurant photos ─────────────────────────────────────────────────────────
Route::post('/restaurant/cover_photo', [MerchantRestaurantController::class, 'uploadCoverPhoto']);
Route::delete('/restaurant/cover_photo', [MerchantRestaurantController::class, 'removeCoverPhoto']);
Route::post('/restaurant/logo', [MerchantRestaurantController::class, 'uploadLogo']);
Route::delete('/restaurant/logo', [MerchantRestaurantController::class, 'removeLogo']);
Route::post('/restaurant/photos', [MerchantRestaurantController::class, 'uploadPhoto']);
Route::delete('/restaurant/photos/{photoId}', [MerchantRestaurantController::class, 'removePhoto']);
Route::patch('/restaurant/photos/reorder', [MerchantRestaurantController::class, 'reorderPhotos']);

// ── Platform alarm sound (universal, admin-set) ───────────────────────────────
Route::get('/alarm-sound', [MerchantAlarmSettingController::class, 'show'])->name('merchant.alarm-sound.show');
