<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\AirportFastTrackController;
use App\Http\Controllers\Api\V1\EmbassyBankController;
use App\Http\Controllers\Api\V1\EmbassyVisaRecommendationController;
use App\Http\Controllers\Api\V1\EmbassyCarLicenseController;
use App\Http\Controllers\Api\V1\EmbassyResidentialController;
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
Route::post('/submissions/airport-fast-track',    [AirportFastTrackController::class,    'store']);
Route::post('/submissions/embassy-residential',   [EmbassyResidentialController::class,  'store']);
Route::post('/submissions/embassy-car-license',   [EmbassyCarLicenseController::class,   'store']);
Route::post('/submissions/embassy-bank',                  [EmbassyBankController::class,                  'store']);
Route::post('/submissions/embassy-visa-recommendation',   [EmbassyVisaRecommendationController::class,    'store']);

// Favorites
Route::get('/places/{placeId}/favorite',  [FavoritePlaceController::class, 'show']);
Route::post('/places/{placeId}/favorite', [FavoritePlaceController::class, 'toggle']);
