<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DeviceTokenController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\UploadStatsController;
use App\Http\Controllers\Api\V1\VerificationStatusController;
use App\Http\Controllers\Api\V1\DynamicSubmissionController;
use App\Http\Controllers\Api\V1\FavoritePlaceController;
use App\Http\Controllers\Api\V1\FoodOrderController;
use App\Http\Controllers\Api\V1\MerchantApplicationController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\UserAddressController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\SubmissionController;
use App\Http\Controllers\Api\V1\SubmissionResultController;
use App\Http\Controllers\Api\V1\TicketOrderController;
use App\Http\Controllers\Api\V1\TicketOrderEticketController;
use App\Http\Controllers\Api\V1\TicketOrderPaymentController;
use Illuminate\Support\Facades\Route;

// User feature routes — all require auth:sanctum (enforced in api.php prefix group)

// Auth — authenticated actions
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/me',      [AuthController::class, 'me']);

// Profile
Route::put('/profile',             [ProfileController::class, 'update']);
Route::patch('/profile/locale',    [ProfileController::class, 'updateLocale']);
Route::put('/profile/password',    [ProfileController::class, 'changePassword']);
Route::post('/profile/picture',    [ProfileController::class, 'uploadPicture']);
Route::delete('/profile/picture',  [ProfileController::class, 'removePicture']);
Route::delete('/profile',          [ProfileController::class, 'destroy']);
Route::post('/profile/link/google',   [ProfileController::class, 'linkGoogle']);
Route::post('/profile/link/apple',    [ProfileController::class, 'linkApple']);
Route::post('/profile/link/line',     [ProfileController::class, 'linkLine']);
Route::delete('/profile/link/google', [ProfileController::class, 'unlinkGoogle']);
Route::delete('/profile/link/apple',  [ProfileController::class, 'unlinkApple']);
Route::delete('/profile/link/line',   [ProfileController::class, 'unlinkLine']);
Route::post('/profile/phone/request-otp', [ProfileController::class, 'requestPhoneOtp']);
Route::put('/profile/phone',               [ProfileController::class, 'updatePhone']);
Route::post('/profile/email/request-otp',         [ProfileController::class, 'requestEmailOtp']);
Route::put('/profile/email',                       [ProfileController::class, 'updateEmail']);
Route::post('/profile/email/request-removal-otp', [ProfileController::class, 'requestEmailRemovalOtp']);
Route::delete('/profile/email',                    [ProfileController::class, 'removeEmail']);
Route::patch('/profile/simulated-date',  [ProfileController::class, 'updateSimulatedDate']);
Route::post('/profile/trigger-reminder', [ProfileController::class, 'triggerReminder']);

// Documents (passport, 90-day report, other — OCR via Claude vision)
Route::get('/documents',              [DocumentController::class, 'index']);
Route::post('/documents',             [DocumentController::class, 'store']);
Route::delete('/documents/{id}',      [DocumentController::class, 'destroy']);
Route::get('/documents/upload-stats', UploadStatsController::class);

// Submissions
Route::get('/submissions',                 [SubmissionController::class,       'index']);
Route::get('/submissions/active',          [SubmissionController::class,       'active']);
Route::get('/submissions/{id}',            [SubmissionController::class,       'show']);
Route::post('/submissions/{id}/cancel',    [SubmissionController::class,       'cancel']);
Route::delete('/submissions/{id}',         [SubmissionController::class,       'destroy']);
Route::post('/submissions/dynamic',        [DynamicSubmissionController::class,'store']);
Route::get('/submissions/{id}/result',     [SubmissionResultController::class, 'show']);

// Payments
Route::post('/submissions/{id}/payment',          [PaymentController::class, 'store']);
Route::get('/submissions/{id}/payment',           [PaymentController::class, 'show']);
Route::post('/submissions/{id}/payment/sync',     [PaymentController::class, 'sync']);
Route::post('/submissions/{id}/payment/notify',   [PaymentController::class, 'notify']);

// Ticket orders
Route::post('/ticket-orders',                              [TicketOrderController::class,        'store']);
Route::get('/ticket-orders',                               [TicketOrderController::class,        'index']);
Route::get('/ticket-orders/active',                        [TicketOrderController::class,        'active']);
Route::get('/ticket-orders/{id}',                          [TicketOrderController::class,        'show']);
Route::post('/ticket-orders/{id}/cancel',                  [TicketOrderController::class,        'cancel']);
Route::delete('/ticket-orders/{id}',                       [TicketOrderController::class,        'destroy']);
Route::post('/ticket-orders/{id}/payment',                 [TicketOrderPaymentController::class, 'store']);
Route::get('/ticket-orders/{id}/payment',                  [TicketOrderPaymentController::class, 'show']);
Route::post('/ticket-orders/{id}/payment/sync',            [TicketOrderPaymentController::class, 'sync']);
Route::post('/ticket-orders/{id}/payment/notify',          [TicketOrderPaymentController::class, 'notify']);
Route::get('/ticket-orders/{id}/eticket',                  [TicketOrderEticketController::class, 'show']);

// Favorites
Route::get('/favorites/places/ids',       [FavoritePlaceController::class, 'ids']);
Route::get('/places/{placeId}/favorite',  [FavoritePlaceController::class, 'show']);
Route::post('/places/{placeId}/favorite', [FavoritePlaceController::class, 'toggle']);

// Notifications
Route::get('/notifications',              [NotificationController::class, 'index']);
Route::put('/notifications/read-all',     [NotificationController::class, 'markAllRead']);
Route::patch('/notifications/{id}/read',  [NotificationController::class, 'markOneRead']);
Route::delete('/notifications/{id}',      [NotificationController::class, 'destroy']);
Route::delete('/notifications',           [NotificationController::class, 'destroyAll']);

// Verification status — Moi Verified requirements check
Route::get('/verification/status', VerificationStatusController::class);

// Merchant application — single-identity model (Grab/LINE-style): an existing
// customer applies to become a merchant from their own account, no new User row.
Route::get('/merchant/apply',    [MerchantApplicationController::class, 'show']);
Route::post('/merchant/apply',   [MerchantApplicationController::class, 'store']);
Route::delete('/merchant/apply', [MerchantApplicationController::class, 'destroy']);

// Device tokens — push notification registration
Route::post('/device-tokens',   [DeviceTokenController::class, 'store']);
Route::delete('/device-tokens', [DeviceTokenController::class, 'destroy']);

// User delivery addresses
Route::get('/addresses',                    [UserAddressController::class, 'index']);
Route::post('/addresses',                   [UserAddressController::class, 'store']);
Route::put('/addresses/{id}',               [UserAddressController::class, 'update']);
Route::delete('/addresses/{id}',            [UserAddressController::class, 'destroy']);
Route::post('/addresses/{id}/set-default',  [UserAddressController::class, 'setDefault']);

// Food orders
Route::get('/food-orders',                [FoodOrderController::class, 'index']);
Route::post('/food-orders',               [FoodOrderController::class, 'store']);
Route::get('/food-orders/active',         [FoodOrderController::class, 'active']);
Route::get('/food-orders/{id}',           [FoodOrderController::class, 'show']);
Route::post('/food-orders/{id}/cancel',   [FoodOrderController::class, 'cancel']);
Route::delete('/food-orders/{id}',        [FoodOrderController::class, 'destroy']);
Route::post('/food-orders/{id}/complete',        [FoodOrderController::class, 'complete']);
Route::post('/food-orders/{id}/review',          [FoodOrderController::class, 'review']);
Route::post('/food-orders/{id}/notify-line-pay', [FoodOrderController::class, 'notifyLinePay']);
Route::get('/food-orders/{id}/chat',          [\App\Http\Controllers\Api\V1\OrderChatController::class, 'index']);
Route::post('/food-orders/{id}/chat',         [\App\Http\Controllers\Api\V1\OrderChatController::class, 'store']);
Route::post('/food-orders/{id}/chat/read',              [\App\Http\Controllers\Api\V1\OrderChatController::class, 'markRead']);
Route::delete('/food-orders/{id}/chat/{messageId}',     [\App\Http\Controllers\Api\V1\OrderChatController::class, 'destroy']);

