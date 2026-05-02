<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Merchant\V1\MerchantAnalyticsController;
use App\Http\Controllers\Api\Merchant\V1\MerchantOrderChatController;
use App\Http\Controllers\Api\Merchant\V1\MerchantOrderController;
use App\Http\Controllers\Api\Merchant\V1\MerchantRestaurantController;
use App\Http\Controllers\Api\Merchant\V1\MenuCategoryController;
use App\Http\Controllers\Api\Merchant\V1\MenuItemController;
use Illuminate\Support\Facades\Route;

// ── Restaurant ────────────────────────────────────────────────────────────────
Route::get('/restaurant',    [MerchantRestaurantController::class, 'show']);
Route::post('/restaurant',   [MerchantRestaurantController::class, 'store']);
Route::put('/restaurant',    [MerchantRestaurantController::class, 'update']);
Route::patch('/restaurant',  [MerchantRestaurantController::class, 'update']);

// ── Menu categories ───────────────────────────────────────────────────────────
Route::get('/menu/categories',          [MenuCategoryController::class, 'index']);
Route::post('/menu/categories',         [MenuCategoryController::class, 'store']);
Route::put('/menu/categories/{id}',     [MenuCategoryController::class, 'update']);
Route::delete('/menu/categories/{id}',  [MenuCategoryController::class, 'destroy']);

// ── Menu items ────────────────────────────────────────────────────────────────
Route::post('/menu/categories/{categoryId}/items', [MenuItemController::class, 'store']);
Route::put('/menu/items/{id}',    [MenuItemController::class, 'update']);
Route::patch('/menu/items/{id}',  [MenuItemController::class, 'update']);
Route::delete('/menu/items/{id}', [MenuItemController::class, 'destroy']);

// ── Analytics ─────────────────────────────────────────────────────────────────
Route::get('/analytics', [MerchantAnalyticsController::class, 'index']);

// ── Orders ────────────────────────────────────────────────────────────────────
Route::get('/orders',                [MerchantOrderController::class, 'index']);
Route::get('/orders/{id}',           [MerchantOrderController::class, 'show']);
Route::put('/orders/{id}/status',    [MerchantOrderController::class, 'updateStatus']);
Route::patch('/orders/{id}/status',  [MerchantOrderController::class, 'updateStatus']);

// ── Order chat ────────────────────────────────────────────────────────────────
Route::get('/orders/{id}/chat',   [MerchantOrderChatController::class, 'index']);
Route::post('/orders/{id}/chat',  [MerchantOrderChatController::class, 'store']);

// ── Restaurant photos ─────────────────────────────────────────────────────────
Route::post('/restaurant/cover_photo', [MerchantRestaurantController::class, 'uploadCoverPhoto']);
Route::delete('/restaurant/cover_photo', [MerchantRestaurantController::class, 'removeCoverPhoto']);
Route::post('/restaurant/logo', [MerchantRestaurantController::class, 'uploadLogo']);
Route::delete('/restaurant/logo', [MerchantRestaurantController::class, 'removeLogo']);
