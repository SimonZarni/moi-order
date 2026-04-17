<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\V1\AdminAuthController;
use App\Http\Controllers\Api\Admin\V1\AdminCategoryController;
use App\Http\Controllers\Api\Admin\V1\AdminPaymentController;
use App\Http\Controllers\Api\Admin\V1\AdminPlaceController;
use App\Http\Controllers\Api\Admin\V1\AdminServiceController;
use App\Http\Controllers\Api\Admin\V1\AdminSubmissionController;
use App\Http\Controllers\Api\Admin\V1\AdminTagController;
use App\Http\Controllers\Api\Admin\V1\AdminTicketController;
use App\Http\Controllers\Api\Admin\V1\AdminTicketOrderController;
use App\Http\Controllers\Api\Admin\V1\AdminTicketVariantController;
use App\Http\Controllers\Api\Admin\V1\AdminUserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Authenticated Routes — requires auth:sanctum + admin.auth
|--------------------------------------------------------------------------
*/

// ── Auth ─────────────────────────────────────────────────────────────────────
Route::prefix('auth')->name('admin.auth.')->group(function (): void {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AdminAuthController::class, 'me'])->name('me');
});

// ── Submissions ───────────────────────────────────────────────────────────────
Route::prefix('submissions')->name('admin.submissions.')->group(function (): void {
    Route::get('/', [AdminSubmissionController::class, 'index'])->name('index');
    Route::get('/{submission}', [AdminSubmissionController::class, 'show'])->name('show');
    Route::patch('/{submission}/status', [AdminSubmissionController::class, 'updateStatus'])->name('updateStatus');
});

// ── Services + Service Types ──────────────────────────────────────────────────
Route::prefix('services')->name('admin.services.')->group(function (): void {
    Route::get('/', [AdminServiceController::class, 'index'])->name('index');
    Route::post('/', [AdminServiceController::class, 'store'])->name('store');
    Route::put('/{service}', [AdminServiceController::class, 'update'])->name('update');
    Route::delete('/{service}', [AdminServiceController::class, 'destroy'])->name('destroy');

    // Service Types sub-resource
    Route::get('/{service}/types', [AdminServiceController::class, 'types'])->name('types.index');
    Route::post('/{service}/types', [AdminServiceController::class, 'storeType'])->name('types.store');
    Route::put('/{service}/types/{type}', [AdminServiceController::class, 'updateType'])->name('types.update');
    Route::delete('/{service}/types/{type}', [AdminServiceController::class, 'destroyType'])->name('types.destroy');
});

// ── Users ─────────────────────────────────────────────────────────────────────
Route::prefix('users')->name('admin.users.')->group(function (): void {
    Route::get('/',    [AdminUserController::class, 'index'])->name('index');
    Route::post('/',   [AdminUserController::class, 'store'])->name('store');
    Route::get('/{user}',    [AdminUserController::class, 'show'])->name('show');
    Route::put('/{user}',    [AdminUserController::class, 'update'])->name('update');
    Route::delete('/{user}', [AdminUserController::class, 'destroy'])->name('destroy');
    // Restore requires withTrashed lookup — plain int $id, not route model binding
    Route::patch('/{id}/restore',      [AdminUserController::class, 'restore'])->name('restore')->whereNumber('id');
    Route::patch('/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin'])->name('toggle-admin');
});

// ── Payments ──────────────────────────────────────────────────────────────────
Route::prefix('payments')->name('admin.payments.')->group(function (): void {
    Route::get('/', [AdminPaymentController::class, 'index'])->name('index');
    Route::get('/{payment}', [AdminPaymentController::class, 'show'])->name('show');
});

// ── Places + Images ───────────────────────────────────────────────────────────
Route::prefix('places')->name('admin.places.')->group(function (): void {
    Route::get('/', [AdminPlaceController::class, 'index'])->name('index');
    Route::post('/', [AdminPlaceController::class, 'store'])->name('store');
    Route::get('/{place}', [AdminPlaceController::class, 'show'])->name('show');
    Route::put('/{place}', [AdminPlaceController::class, 'update'])->name('update');
    Route::delete('/{place}', [AdminPlaceController::class, 'destroy'])->name('destroy');

    // Image sub-resource
    Route::post('/{place}/images', [AdminPlaceController::class, 'uploadImages'])->name('images.store');
    Route::delete('/{place}/images/{image}', [AdminPlaceController::class, 'deleteImage'])->name('images.destroy');
    Route::patch('/{place}/images/reorder', [AdminPlaceController::class, 'reorderImages'])->name('images.reorder');
});

// ── Categories ────────────────────────────────────────────────────────────────
Route::prefix('categories')->name('admin.categories.')->group(function (): void {
    Route::get('/', [AdminCategoryController::class, 'index'])->name('index');
    Route::post('/', [AdminCategoryController::class, 'store'])->name('store');
    Route::get('/{category}', [AdminCategoryController::class, 'show'])->name('show');
    Route::put('/{category}', [AdminCategoryController::class, 'update'])->name('update');
    Route::delete('/{category}', [AdminCategoryController::class, 'destroy'])->name('destroy');
    // Restore requires withTrashed lookup — uses plain int $id, not route model binding
    Route::patch('/{id}/restore', [AdminCategoryController::class, 'restore'])->name('restore')
        ->whereNumber('id');
});

// ── Tickets + Variants + Ticket Orders ───────────────────────────────────────
Route::prefix('tickets')->name('admin.tickets.')->group(function (): void {
    Route::get('/',           [AdminTicketController::class, 'index'])->name('index');
    Route::post('/',          [AdminTicketController::class, 'store'])->name('store');
    Route::get('/{ticket}',   [AdminTicketController::class, 'show'])->name('show');
    Route::put('/{ticket}',   [AdminTicketController::class, 'update'])->name('update');
    Route::delete('/{ticket}',[AdminTicketController::class, 'destroy'])->name('destroy');

    // Variant sub-resource
    Route::get('/{ticket}/variants',                  [AdminTicketVariantController::class, 'index'])->name('variants.index');
    Route::post('/{ticket}/variants',                 [AdminTicketVariantController::class, 'store'])->name('variants.store');
    Route::put('/{ticket}/variants/{variant}',        [AdminTicketVariantController::class, 'update'])->name('variants.update');
    Route::delete('/{ticket}/variants/{variant}',     [AdminTicketVariantController::class, 'destroy'])->name('variants.destroy');
});

Route::prefix('ticket-orders')->name('admin.ticket-orders.')->group(function (): void {
    Route::get('/',                              [AdminTicketOrderController::class, 'index'])->name('index');
    Route::get('/{ticketOrder}',                 [AdminTicketOrderController::class, 'show'])->name('show');
    Route::post('/{ticketOrder}/eticket',        [AdminTicketOrderController::class, 'uploadEticket'])->name('eticket.store');
});

// ── Tags ──────────────────────────────────────────────────────────────────────
Route::prefix('tags')->name('admin.tags.')->group(function (): void {
    Route::get('/', [AdminTagController::class, 'index'])->name('index');
    Route::post('/', [AdminTagController::class, 'store'])->name('store');
    Route::get('/{tag}', [AdminTagController::class, 'show'])->name('show');
    Route::put('/{tag}', [AdminTagController::class, 'update'])->name('update');
    Route::delete('/{tag}', [AdminTagController::class, 'destroy'])->name('destroy');
    // Restore requires withTrashed lookup — uses plain int $id, not route model binding
    Route::patch('/{id}/restore', [AdminTagController::class, 'restore'])->name('restore')
        ->whereNumber('id');
});
