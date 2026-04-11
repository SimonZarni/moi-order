<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CompanyRegistrationController;
use App\Http\Controllers\Api\V1\FavoritePlaceController;
use App\Http\Controllers\Api\V1\SubmissionController;
use Illuminate\Support\Facades\Route;

// User feature routes — all require auth:sanctum (enforced in api.php prefix group)

// Auth — authenticated actions
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/me',      [AuthController::class, 'me']);

// Submissions
Route::get('/submissions',              [SubmissionController::class, 'index']);
Route::get('/submissions/{id}',         [SubmissionController::class, 'show']);
Route::post('/submissions/90-day-report',         [SubmissionController::class,         'store']);
Route::post('/submissions/company-registration',  [CompanyRegistrationController::class, 'store']);

// Favorites
Route::get('/places/{placeId}/favorite',  [FavoritePlaceController::class, 'show']);
Route::post('/places/{placeId}/favorite', [FavoritePlaceController::class, 'toggle']);
