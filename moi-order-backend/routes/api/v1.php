<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DynamicSubmissionController;
use App\Http\Controllers\Api\V1\FavoritePlaceController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\SubmissionController;
use App\Http\Controllers\Api\V1\TicketOrderController;
use App\Http\Controllers\Api\V1\TicketOrderEticketController;
use App\Http\Controllers\Api\V1\TicketOrderPaymentController;
use Illuminate\Support\Facades\Route;

// User feature routes — all require auth:sanctum (enforced in api.php prefix group)

// Auth — authenticated actions
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/me',      [AuthController::class, 'me']);

// Profile
Route::put('/profile',          [ProfileController::class, 'update']);
Route::put('/profile/password', [ProfileController::class, 'changePassword']);
Route::delete('/profile',       [ProfileController::class, 'destroy']);

// Submissions
Route::get('/submissions',          [SubmissionController::class,        'index']);
Route::get('/submissions/{id}',     [SubmissionController::class,        'show']);
Route::post('/submissions/dynamic', [DynamicSubmissionController::class, 'store']);

// Payments
Route::post('/submissions/{id}/payment',       [PaymentController::class, 'store']);
Route::get('/submissions/{id}/payment',        [PaymentController::class, 'show']);
Route::post('/submissions/{id}/payment/sync',  [PaymentController::class, 'sync']);

// Ticket orders
Route::post('/ticket-orders',                              [TicketOrderController::class,        'store']);
Route::get('/ticket-orders',                               [TicketOrderController::class,        'index']);
Route::get('/ticket-orders/{id}',                          [TicketOrderController::class,        'show']);
Route::post('/ticket-orders/{id}/payment',                 [TicketOrderPaymentController::class, 'store']);
Route::get('/ticket-orders/{id}/payment',                  [TicketOrderPaymentController::class, 'show']);
Route::post('/ticket-orders/{id}/payment/sync',            [TicketOrderPaymentController::class, 'sync']);
Route::get('/ticket-orders/{id}/eticket',                  [TicketOrderEticketController::class, 'show']);

// Favorites
Route::get('/places/{placeId}/favorite',  [FavoritePlaceController::class, 'show']);
Route::post('/places/{placeId}/favorite', [FavoritePlaceController::class, 'toggle']);
