<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\V1\AdminAccountController;
use App\Http\Controllers\Api\Admin\V1\AdminAuthController;
use App\Http\Controllers\Api\Admin\V1\AdminHomeCardController;
use App\Http\Controllers\Api\Admin\V1\AdminDashboardController;
use App\Http\Controllers\Api\Admin\V1\AdminDocumentTypeController;
use App\Http\Controllers\Api\Admin\V1\AdminFoodOrderController;
use App\Http\Controllers\Api\Admin\V1\AdminMenuCategoryController;
use App\Http\Controllers\Api\Admin\V1\AdminMenuItemController;
use App\Http\Controllers\Api\Admin\V1\AdminNotificationController;
use App\Http\Controllers\Api\Admin\V1\AdminCategoryController;
use App\Http\Controllers\Api\Admin\V1\AdminPaymentController;
use App\Http\Controllers\Api\Admin\V1\AdminPlaceController;
use App\Http\Controllers\Api\Admin\V1\AdminRestaurantController;
use App\Http\Controllers\Api\Admin\V1\AdminRoleController;
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

// ── Dashboard ─────────────────────────────────────────────────────────────────
Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');

// ── Notifications ─────────────────────────────────────────────────────────────
Route::prefix('notifications')->name('admin.notifications.')->group(function (): void {
    Route::get('/', [AdminNotificationController::class, 'index'])->name('index');
    Route::put('/read-all', [AdminNotificationController::class, 'markAllRead'])->name('read-all');
    Route::patch('/{id}/read', [AdminNotificationController::class, 'markOneRead'])->name('read');
    Route::delete('/{id}', [AdminNotificationController::class, 'destroy'])->name('destroy');
    Route::delete('/', [AdminNotificationController::class, 'destroyAll'])->name('destroy-all');
});

// ── Auth ─────────────────────────────────────────────────────────────────────
Route::prefix('auth')->name('admin.auth.')->group(function (): void {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AdminAuthController::class, 'me'])->name('me');
});

// ── Roles & Permissions ───────────────────────────────────────────────────────
Route::prefix('roles')->name('admin.roles.')->group(function (): void {
    Route::get('/permissions', [AdminRoleController::class, 'index'])->name('permissions.index');
    Route::put('/{role}/permissions', [AdminRoleController::class, 'update'])
        ->name('permissions.update')
        ->middleware('check.permission:admins.manage');
});

// ── Admin Accounts ────────────────────────────────────────────────────────────
Route::prefix('admins')->name('admin.admins.')->middleware('check.permission:admins.manage')->group(function (): void {
    Route::get('/', [AdminAccountController::class, 'index'])->name('index');
    Route::post('/', [AdminAccountController::class, 'store'])->name('store');
    Route::put('/{id}', [AdminAccountController::class, 'update'])->name('update');
    Route::patch('/{id}/toggle', [AdminAccountController::class, 'toggle'])->name('toggle');
    Route::delete('/{id}', [AdminAccountController::class, 'destroy'])->name('destroy');
});

// ── Submissions ───────────────────────────────────────────────────────────────
Route::prefix('submissions')->name('admin.submissions.')->group(function (): void {
    Route::get('/', [AdminSubmissionController::class, 'index'])->name('index')
        ->middleware('check.permission:submissions.view');
    Route::get('/{submission}', [AdminSubmissionController::class, 'show'])->name('show')
        ->middleware('check.permission:submissions.view');
    Route::patch('/{submission}/status', [AdminSubmissionController::class, 'updateStatus'])->name('updateStatus')
        ->middleware('check.permission:submissions.manage');
    Route::post('/{submission}/result', [AdminSubmissionController::class, 'uploadResultFile'])->name('result.store')
        ->middleware('check.permission:submissions.manage');
    Route::get('/{submission}/result', [AdminSubmissionController::class, 'downloadResultFile'])->name('result.download')
        ->middleware('check.permission:submissions.view');
});

// ── Services + Service Types ──────────────────────────────────────────────────
Route::prefix('services')->name('admin.services.')->group(function (): void {
    Route::get('/', [AdminServiceController::class, 'index'])->name('index');
    Route::post('/', [AdminServiceController::class, 'store'])->name('store')
        ->middleware('check.permission:services.create');
    Route::get('/{service}', [AdminServiceController::class, 'show'])->name('show');
    Route::put('/{service}', [AdminServiceController::class, 'update'])->name('update')
        ->middleware('check.permission:services.update');
    Route::delete('/{service}', [AdminServiceController::class, 'destroy'])->name('destroy')
        ->middleware('check.permission:services.delete');

    Route::get('/{service}/types', [AdminServiceController::class, 'types'])->name('types.index');
    Route::post('/{service}/types', [AdminServiceController::class, 'storeType'])->name('types.store')
        ->middleware('check.permission:service_types.create');
    Route::put('/{service}/types/{type}', [AdminServiceController::class, 'updateType'])->name('types.update')
        ->middleware('check.permission:service_types.update');
    Route::delete('/{service}/types/{type}', [AdminServiceController::class, 'destroyType'])->name('types.destroy')
        ->middleware('check.permission:service_types.delete');
});

// ── Users ─────────────────────────────────────────────────────────────────────
Route::prefix('users')->name('admin.users.')->group(function (): void {
    Route::get('/',       [AdminUserController::class, 'index'])->name('index');
    Route::post('/',      [AdminUserController::class, 'store'])->name('store')
        ->middleware('check.permission:users.manage');
    Route::get('/{user}', [AdminUserController::class, 'show'])->name('show');
    Route::put('/{user}', [AdminUserController::class, 'update'])->name('update')
        ->middleware('check.permission:users.manage');
    Route::delete('/{user}', [AdminUserController::class, 'destroy'])->name('destroy')
        ->middleware('check.permission:users.delete');
    Route::patch('/{id}/restore', [AdminUserController::class, 'restore'])->name('restore')
        ->whereNumber('id')
        ->middleware('check.permission:users.manage');
    Route::patch('/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin'])->name('toggle-admin')
        ->middleware('check.permission:users.manage');
    Route::patch('/{user}/suspend',  [AdminUserController::class, 'suspend'])->name('suspend')
        ->middleware('check.permission:users.manage');
    Route::patch('/{user}/ban',      [AdminUserController::class, 'ban'])->name('ban')
        ->middleware('check.permission:users.manage');
    Route::patch('/{user}/activate', [AdminUserController::class, 'activate'])->name('activate')
        ->middleware('check.permission:users.manage');
});

// ── Payments ──────────────────────────────────────────────────────────────────
Route::prefix('payments')->name('admin.payments.')->group(function (): void {
    Route::get('/', [AdminPaymentController::class, 'index'])->name('index')
        ->middleware('check.permission:payments.view');
    Route::get('/stats', [AdminPaymentController::class, 'stats'])->name('stats')
        ->middleware('check.permission:payments.view');
    Route::get('/{payment}', [AdminPaymentController::class, 'show'])->name('show')
        ->middleware('check.permission:payments.view');
    Route::post('/{payment}/confirm', [AdminPaymentController::class, 'confirm'])->name('confirm')
        ->middleware('check.permission:payments.manage');
    Route::post('/{payment}/regenerate', [AdminPaymentController::class, 'regenerate'])->name('regenerate')
        ->middleware('check.permission:payments.manage');
});

// ── Places + Images ───────────────────────────────────────────────────────────
Route::prefix('places')->name('admin.places.')->group(function (): void {
    Route::post('/import', [AdminPlaceController::class, 'import'])->name('import')
        ->middleware('check.permission:places.create');
    Route::get('/import/{batch}', [AdminPlaceController::class, 'importStatus'])->name('import.status');
    Route::get('/', [AdminPlaceController::class, 'index'])->name('index');
    Route::post('/', [AdminPlaceController::class, 'store'])->name('store')
        ->middleware('check.permission:places.create');
    Route::get('/{place}', [AdminPlaceController::class, 'show'])->name('show');
    Route::put('/{place}', [AdminPlaceController::class, 'update'])->name('update')
        ->middleware('check.permission:places.update');
    Route::delete('/{place}', [AdminPlaceController::class, 'destroy'])->name('destroy')
        ->middleware('check.permission:places.delete');

    Route::post('/{place}/images', [AdminPlaceController::class, 'uploadImages'])->name('images.store')
        ->middleware('check.permission:places.update');
    Route::delete('/{place}/images/{image}', [AdminPlaceController::class, 'deleteImage'])->name('images.destroy')
        ->middleware('check.permission:places.update');
    Route::patch('/{place}/images/reorder', [AdminPlaceController::class, 'reorderImages'])->name('images.reorder')
        ->middleware('check.permission:places.update');
});

// ── Categories ────────────────────────────────────────────────────────────────
Route::prefix('categories')->name('admin.categories.')->group(function (): void {
    Route::get('/', [AdminCategoryController::class, 'index'])->name('index');
    Route::post('/', [AdminCategoryController::class, 'store'])->name('store');
    Route::get('/{category}', [AdminCategoryController::class, 'show'])->name('show');
    Route::put('/{category}', [AdminCategoryController::class, 'update'])->name('update');
    Route::delete('/{category}', [AdminCategoryController::class, 'destroy'])->name('destroy');
    Route::patch('/{id}/restore', [AdminCategoryController::class, 'restore'])->name('restore')
        ->whereNumber('id');
});

// ── Tickets + Variants + Ticket Orders ───────────────────────────────────────
Route::prefix('tickets')->name('admin.tickets.')->group(function (): void {
    Route::get('/',            [AdminTicketController::class, 'index'])->name('index');
    Route::post('/',           [AdminTicketController::class, 'store'])->name('store');
    Route::get('/{ticket}',    [AdminTicketController::class, 'show'])->name('show');
    Route::put('/{ticket}',    [AdminTicketController::class, 'update'])->name('update');
    Route::delete('/{ticket}', [AdminTicketController::class, 'destroy'])->name('destroy');

    Route::get('/{ticket}/variants',              [AdminTicketVariantController::class, 'index'])->name('variants.index');
    Route::post('/{ticket}/variants',             [AdminTicketVariantController::class, 'store'])->name('variants.store');
    Route::put('/{ticket}/variants/{variant}',    [AdminTicketVariantController::class, 'update'])->name('variants.update');
    Route::delete('/{ticket}/variants/{variant}', [AdminTicketVariantController::class, 'destroy'])->name('variants.destroy');

    Route::post('/{ticket}/images',           [AdminTicketController::class, 'uploadImages'])->name('images.store');
    Route::delete('/{ticket}/images/{image}', [AdminTicketController::class, 'deleteImage'])->name('images.destroy');
});

Route::prefix('ticket-orders')->name('admin.ticket-orders.')->group(function (): void {
    Route::get('/',                       [AdminTicketOrderController::class, 'index'])->name('index');
    Route::get('/{ticketOrder}',          [AdminTicketOrderController::class, 'show'])->name('show');
    Route::post('/{ticketOrder}/eticket', [AdminTicketOrderController::class, 'uploadEticket'])->name('eticket.store');
    Route::get('/{ticketOrder}/eticket',  [AdminTicketOrderController::class, 'downloadEticket'])->name('eticket.download');
});

// ── Tags ──────────────────────────────────────────────────────────────────────
Route::prefix('tags')->name('admin.tags.')->group(function (): void {
    Route::get('/',        [AdminTagController::class, 'index'])->name('index');
    Route::post('/',       [AdminTagController::class, 'store'])->name('store');
    Route::get('/{tag}',   [AdminTagController::class, 'show'])->name('show');
    Route::put('/{tag}',   [AdminTagController::class, 'update'])->name('update');
    Route::delete('/{tag}',[AdminTagController::class, 'destroy'])->name('destroy');
    Route::patch('/{id}/restore', [AdminTagController::class, 'restore'])->name('restore')
        ->whereNumber('id');
});

// ── Restaurants + nested menu ─────────────────────────────────────────────────
Route::prefix('restaurants')->name('admin.restaurants.')->group(function (): void {
    Route::get('/',             [AdminRestaurantController::class, 'index'])->name('index');
    Route::post('/',            [AdminRestaurantController::class, 'store'])->name('store')
        ->middleware('check.permission:restaurants.manage');
    Route::get('/{restaurant}', [AdminRestaurantController::class, 'show'])->name('show');
    Route::put('/{restaurant}', [AdminRestaurantController::class, 'update'])->name('update')
        ->middleware('check.permission:restaurants.manage');
    Route::delete('/{restaurant}', [AdminRestaurantController::class, 'destroy'])->name('destroy')
        ->middleware('check.permission:restaurants.manage');
    Route::patch('/{restaurant}/status', [AdminRestaurantController::class, 'updateStatus'])->name('update-status')
        ->middleware('check.permission:restaurants.manage');

    Route::post('/{restaurant}/categories', [AdminMenuCategoryController::class, 'store'])->name('categories.store')
        ->middleware('check.permission:restaurants.manage');
    Route::put('/{restaurant}/categories/{categoryId}', [AdminMenuCategoryController::class, 'update'])->name('categories.update')
        ->middleware('check.permission:restaurants.manage');
    Route::delete('/{restaurant}/categories/{categoryId}', [AdminMenuCategoryController::class, 'destroy'])->name('categories.destroy')
        ->middleware('check.permission:restaurants.manage');

    Route::post('/{restaurant}/items', [AdminMenuItemController::class, 'store'])->name('items.store')
        ->middleware('check.permission:restaurants.manage');
    Route::put('/{restaurant}/items/{itemId}', [AdminMenuItemController::class, 'update'])->name('items.update')
        ->middleware('check.permission:restaurants.manage');
    Route::delete('/{restaurant}/items/{itemId}', [AdminMenuItemController::class, 'destroy'])->name('items.destroy')
        ->middleware('check.permission:restaurants.manage');
});

// ── Food Orders ───────────────────────────────────────────────────────────────
Route::prefix('food-orders')->name('admin.food-orders.')->group(function (): void {
    Route::get('/',            [AdminFoodOrderController::class, 'index'])->name('index');
    Route::get('/{foodOrder}', [AdminFoodOrderController::class, 'show'])->name('show');
    Route::post('/{foodOrder}/confirm-payment', [AdminFoodOrderController::class, 'confirmPayment'])->name('confirm-payment');
});

// ── Home Cards ────────────────────────────────────────────────────────────────
Route::prefix('home-cards')->name('admin.home-cards.')->middleware('check.permission:home_cards.manage')->group(function (): void {
    Route::get('/',                            [AdminHomeCardController::class, 'index'])->name('index');
    Route::post('/',                           [AdminHomeCardController::class, 'store'])->name('store');
    Route::put('/reorder',                     [AdminHomeCardController::class, 'reorder'])->name('reorder');
    Route::get('/{homeCard}',                  [AdminHomeCardController::class, 'show'])->name('show');
    Route::put('/{homeCard}',                  [AdminHomeCardController::class, 'update'])->name('update');
    Route::delete('/{homeCard}',               [AdminHomeCardController::class, 'destroy'])->name('destroy');
    Route::patch('/{id}/restore',              [AdminHomeCardController::class, 'restore'])->name('restore')->whereNumber('id');
});

// ── Document Types ────────────────────────────────────────────────────────────
Route::prefix('document-types')->name('admin.document-types.')->group(function (): void {
    Route::get('/', [AdminDocumentTypeController::class, 'index'])->name('index');
    Route::post('/', [AdminDocumentTypeController::class, 'store'])->name('store')
        ->middleware('check.permission:document_types.manage');
    Route::put('/{documentType}', [AdminDocumentTypeController::class, 'update'])->name('update')
        ->middleware('check.permission:document_types.manage');
    Route::delete('/{documentType}', [AdminDocumentTypeController::class, 'destroy'])->name('destroy')
        ->middleware('check.permission:document_types.manage');
    Route::patch('/{id}/restore', [AdminDocumentTypeController::class, 'restore'])->name('restore')
        ->whereNumber('id')
        ->middleware('check.permission:document_types.manage');
});
