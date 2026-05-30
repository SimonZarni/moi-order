<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Admin\V1\AdminAuditLogController;
use App\Http\Controllers\Api\Admin\V1\AdminSystemHealthController;
use App\Http\Controllers\Api\Admin\V1\AdminAccountController;
use App\Http\Controllers\Api\Admin\V1\AdminAppConfigController;
use App\Http\Controllers\Api\Admin\V1\AdminInAppAlertController;
use App\Http\Controllers\Api\Admin\V1\AdminSessionController;
use App\Http\Controllers\Api\Admin\V1\AdminMaintenanceController;
use App\Http\Controllers\Api\Admin\V1\AdminAuthController;
use App\Http\Controllers\Api\Admin\V1\AdminKycController;
use App\Http\Controllers\Api\Admin\V1\AdminMerchantCreateController;
use App\Http\Controllers\Api\Admin\V1\AdminHomeCardController;
use App\Http\Controllers\Api\Admin\V1\AdminHomeCardRouteController;
use App\Http\Controllers\Api\Admin\V1\AdminHomeCardIconController;
use App\Http\Controllers\Api\Admin\V1\AdminDashboardController;
use App\Http\Controllers\Api\Admin\V1\AdminDocumentTypeController;
use App\Http\Controllers\Api\Admin\V1\AdminFoodOrderController;
use App\Http\Controllers\Api\Admin\V1\AdminMenuCategoryController;
use App\Http\Controllers\Api\Admin\V1\AdminMenuItemController;
use App\Http\Controllers\Api\Admin\V1\AdminNotificationController;
use App\Http\Controllers\Api\Admin\V1\AdminCustomNotificationController;
use App\Http\Controllers\Api\Admin\V1\AdminCategoryController;
use App\Http\Controllers\Api\Admin\V1\AdminPaymentController;
use App\Http\Controllers\Api\Admin\V1\AdminPaymentSettingController;
use App\Http\Controllers\Api\Admin\V1\AdminEmergencyContactController;
use App\Http\Controllers\Api\Admin\V1\AdminGooglePlaceController;
use App\Http\Controllers\Api\Admin\V1\AdminPlaceController;
use App\Http\Controllers\Api\Admin\V1\AdminRestaurantController;
use App\Http\Controllers\Api\Admin\V1\AdminRoleController;
use App\Http\Controllers\Api\Admin\V1\AdminServiceCategoryController;
use App\Http\Controllers\Api\Admin\V1\AdminServiceController;
use App\Http\Controllers\Api\Admin\V1\AdminSubmissionController;
use App\Http\Controllers\Api\Admin\V1\AdminTagController;
use App\Http\Controllers\Api\Admin\V1\AdminTicketController;
use App\Http\Controllers\Api\Admin\V1\AdminTicketOrderController;
use App\Http\Controllers\Api\Admin\V1\AdminTicketVariantController;
use App\Http\Controllers\Api\Admin\V1\AdminUserController;
use App\Http\Controllers\Api\Admin\V1\AdminPushSubscriptionController;
use App\Http\Controllers\Api\Admin\V1\AdminSearchController;
use App\Http\Controllers\Api\Admin\V1\AdminUserDocumentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Authenticated Routes — requires auth:sanctum + admin.auth
|--------------------------------------------------------------------------
*/

// ── Global Search ─────────────────────────────────────────────────────────────
Route::get('/search', AdminSearchController::class)->name('admin.search');

// ── Audit Log ─────────────────────────────────────────────────────────────────
Route::prefix('audit-logs')->name('admin.audit-logs.')->group(function (): void {
    Route::get('/',       [AdminAuditLogController::class, 'index'])->name('index');
    Route::get('/export', [AdminAuditLogController::class, 'export'])->name('export');
});

// ── Heartbeat — excluded from maintenance mode in bootstrap/app.php ───────────
// Admin dashboard calls this every 5 minutes to keep the Sanctum token active.
Route::get('/ping', static function () {
    return response()->json(['pong' => true, 'time' => now()->toIso8601String()]);
})->name('admin.ping');

// ── Dashboard ─────────────────────────────────────────────────────────────────
Route::get('/dashboard',        [AdminDashboardController::class, 'index'])->name('admin.dashboard');
Route::get('/dashboard/export', [AdminDashboardController::class, 'export'])->name('admin.dashboard.export');

// ── Notifications (admin bell) ────────────────────────────────────────────────
Route::prefix('notifications')->name('admin.notifications.')->group(function (): void {
    Route::get('/',    [AdminNotificationController::class, 'index'])->name('index');
    Route::get('/all', [AdminNotificationController::class, 'all'])->name('all');
    Route::put('/read-all', [AdminNotificationController::class, 'markAllRead'])->name('read-all');
    Route::patch('/{id}/read', [AdminNotificationController::class, 'markOneRead'])->name('read');
    Route::delete('/{id}', [AdminNotificationController::class, 'destroy'])->name('destroy');
    Route::delete('/', [AdminNotificationController::class, 'destroyAll'])->name('destroy-all');
});

// ── Browser Push Subscriptions (admin web-push opt-in) ───────────────────────
Route::prefix('push-subscriptions')->name('admin.push-subscriptions.')->group(function (): void {
    Route::post('/',   [AdminPushSubscriptionController::class, 'store'])->name('store');
    Route::delete('/', [AdminPushSubscriptionController::class, 'destroy'])->name('destroy');
});

// ── Custom Notifications (push broadcasts to users) ───────────────────────────
Route::prefix('custom-notifications')->name('admin.custom-notifications.')->group(function (): void {
    Route::get('/',  [AdminCustomNotificationController::class, 'index'])->name('index');
    Route::post('/', [AdminCustomNotificationController::class, 'store'])->name('store');
});

// ── Auth ─────────────────────────────────────────────────────────────────────
Route::prefix('auth')->name('admin.auth.')->group(function (): void {
    Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
    Route::get('/me', [AdminAuthController::class, 'me'])->name('me');
    Route::put('/password', [AdminAuthController::class, 'changePassword'])->name('change-password');
});

// ── Roles & Permissions ───────────────────────────────────────────────────────
Route::prefix('roles')->name('admin.roles.')->group(function (): void {
    Route::get('/permissions', [AdminRoleController::class, 'index'])->name('permissions.index');
    Route::put('/{role}/permissions', [AdminRoleController::class, 'update'])
        ->name('permissions.update')
        ->middleware('check.permission:admins.manage');
});

// ── Admin Accounts ────────────────────────────────────────────────────────────
Route::prefix('admins')->name('admin.admins.')->group(function (): void {
    Route::get('/', [AdminAccountController::class, 'index'])->name('index')
        ->middleware('check.permission:admins.manage');
    Route::put('/{id}', [AdminAccountController::class, 'update'])->name('update')
        ->middleware('check.permission:admins.manage');
    Route::patch('/{id}/toggle', [AdminAccountController::class, 'toggle'])->name('toggle')
        ->middleware('check.permission:admins.manage');
    Route::delete('/{id}', [AdminAccountController::class, 'destroy'])->name('destroy')
        ->middleware('check.permission:admins.manage');

    // Super-admin-only: create account with OTP verification or directly
    Route::middleware('ensure.super_admin')->group(function (): void {
        Route::post('/send-otp', [AdminAccountController::class, 'sendOtp'])->name('send-otp');
        Route::post('/verify-otp', [AdminAccountController::class, 'verifyOtp'])->name('verify-otp');
        Route::post('/', [AdminAccountController::class, 'store'])->name('store');
        Route::post('/direct', [AdminAccountController::class, 'storeDirect'])->name('store-direct');
    });
});

// ── Admin Sessions (super-admin only) ────────────────────────────────────────
Route::middleware('ensure.super_admin')->prefix('sessions')->name('admin.sessions.')->group(function (): void {
    Route::get('/', [AdminSessionController::class, 'index'])->name('index');
    // /others must come before /{tokenId} so "others" is not captured as an integer
    Route::delete('/others', [AdminSessionController::class, 'destroyOthers'])->name('destroyOthers');
    Route::delete('/{tokenId}', [AdminSessionController::class, 'destroy'])->name('destroy')->whereNumber('tokenId');
});

// ── Submissions ───────────────────────────────────────────────────────────────
Route::prefix('submissions')->name('admin.submissions.')->group(function (): void {
    Route::get('/', [AdminSubmissionController::class, 'index'])->name('index')
        ->middleware('check.permission:submissions.view');
    Route::get('/export', [AdminSubmissionController::class, 'export'])->name('export')
        ->middleware('check.permission:submissions.view');
    Route::get('/{submission}', [AdminSubmissionController::class, 'show'])->name('show')
        ->middleware('check.permission:submissions.view');
    Route::patch('/{submission}/status', [AdminSubmissionController::class, 'updateStatus'])->name('updateStatus')
        ->middleware('check.permission:submissions.manage');
    Route::post('/{submission}/confirm-payment', [AdminSubmissionController::class, 'confirmPayment'])->name('confirmPayment')
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
    // slug lookup must come before /{service} to avoid model binding capturing "slug"
    Route::get('/slug/{slug}', [AdminServiceController::class, 'showBySlug'])->name('showBySlug');
    Route::get('/{service}', [AdminServiceController::class, 'show'])->name('show');
    Route::put('/{service}', [AdminServiceController::class, 'update'])->name('update')
        ->middleware('check.permission:services.update');
    Route::patch('/{service}/toggle', [AdminServiceController::class, 'toggle'])->name('toggle')
        ->middleware('check.permission:services.update');
    Route::delete('/{service}', [AdminServiceController::class, 'destroy'])->name('destroy')
        ->middleware('check.permission:services.delete');

    Route::get('/{service}/types', [AdminServiceController::class, 'types'])->name('types.index');
    Route::post('/{service}/types', [AdminServiceController::class, 'storeType'])->name('types.store')
        ->middleware('check.permission:service_types.create');
    // reorder must come before /{service}/types/{type} to avoid {type} binding capturing "reorder"
    Route::put('/{service}/types/reorder', [AdminServiceController::class, 'reorderTypes'])->name('types.reorder')
        ->middleware('check.permission:service_types.update');
    Route::put('/{service}/types/{type}', [AdminServiceController::class, 'updateType'])->name('types.update')
        ->middleware('check.permission:service_types.update');
    Route::patch('/{service}/types/{type}/toggle', [AdminServiceController::class, 'toggleType'])->name('types.toggle')
        ->middleware('check.permission:service_types.update');
    Route::delete('/{service}/types/{type}', [AdminServiceController::class, 'destroyType'])->name('types.destroy')
        ->middleware('check.permission:service_types.delete');
});

// ── Service Categories ────────────────────────────────────────────────────────
Route::prefix('service-categories')->name('admin.service-categories.')->group(function (): void {
    Route::get('/',       [AdminServiceCategoryController::class, 'index'])->name('index');
    Route::post('/',      [AdminServiceCategoryController::class, 'store'])->name('store')
        ->middleware('check.permission:services.create');
    Route::get('/{slug}', [AdminServiceCategoryController::class, 'show'])->name('show');
    Route::put('/{slug}', [AdminServiceCategoryController::class, 'update'])->name('update')
        ->middleware('check.permission:services.update');
    Route::put('/{slug}/services/reorder', [AdminServiceCategoryController::class, 'reorderServices'])
        ->name('services.reorder')
        ->middleware('check.permission:services.update');
});

// ── Users ─────────────────────────────────────────────────────────────────────
Route::prefix('users')->name('admin.users.')->group(function (): void {
    Route::get('/',        [AdminUserController::class, 'index'])->name('index');
    Route::get('/export',  [AdminUserController::class, 'export'])->name('export');
    Route::post('/',       [AdminUserController::class, 'store'])->name('store')
        ->middleware('check.permission:users.manage');
    Route::get('/{user}',  [AdminUserController::class, 'show'])->name('show');
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
    Route::patch('/{user}/role', [AdminUserController::class, 'updateRole'])->name('update-role')
        ->middleware('check.permission:users.manage');

    Route::get('/{user}/activity-log', [AdminUserController::class, 'activityLog'])->name('activity-log');

    // User document sub-routes
    Route::get('/{user}/documents',                    [AdminUserDocumentController::class, 'index'])->name('documents.index');
    Route::post('/{user}/documents',                   [AdminUserDocumentController::class, 'store'])->name('documents.store')
        ->middleware('check.permission:users.manage');
    // Accepts both POST and PATCH: PHP only populates $_POST/$_FILES for POST.
    // Sending a real PATCH with multipart/form-data results in an empty body.
    Route::match(['POST', 'PATCH'], '/{user}/documents/{document}', [AdminUserDocumentController::class, 'update'])->name('documents.update')
        ->middleware('check.permission:users.manage');
    Route::delete('/{user}/documents/{document}',      [AdminUserDocumentController::class, 'destroy'])->name('documents.destroy')
        ->middleware('check.permission:users.manage');
});

// ── Payments ──────────────────────────────────────────────────────────────────
Route::prefix('payments')->name('admin.payments.')->group(function (): void {
    Route::get('/', [AdminPaymentController::class, 'index'])->name('index')
        ->middleware('check.permission:payments.view');
    Route::get('/stats', [AdminPaymentController::class, 'stats'])->name('stats')
        ->middleware('check.permission:payments.view');
    Route::get('/export', [AdminPaymentController::class, 'export'])->name('export')
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
    Route::get('/export', [AdminPlaceController::class, 'export'])->name('export');
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

    // ── Google Place ID management ────────────────────────────────────────────
    Route::post('/search-google', [AdminGooglePlaceController::class, 'searchGoogle'])->name('google.search');
    Route::patch('/{place}/google-place-id', [AdminGooglePlaceController::class, 'saveGooglePlaceId'])->name('google.save-id')
        ->middleware('check.permission:places.update');

    // ── Google Photos (admin-only staging) ────────────────────────────────────
    Route::get('/{place}/google-photos', [AdminGooglePlaceController::class, 'getGooglePhotos'])->name('google.photos.index');
    Route::post('/{place}/google-photos/fetch', [AdminGooglePlaceController::class, 'fetchGooglePhotos'])->name('google.photos.fetch')
        ->middleware('check.permission:places.update');
    Route::post('/{place}/google-photos/{photo}/add-to-gallery', [AdminGooglePlaceController::class, 'addToGallery'])->name('google.photos.add-gallery')
        ->middleware('check.permission:places.update');
    Route::post('/{place}/google-photos/{photo}/remove-from-gallery', [AdminGooglePlaceController::class, 'removeFromGallery'])->name('google.photos.remove-gallery')
        ->middleware('check.permission:places.update');
});

// ── Emergency Contacts + Photos ───────────────────────────────────────────────
Route::prefix('emergency/contacts')->name('admin.emergency.contacts.')->group(function (): void {
    Route::get('/',   [AdminEmergencyContactController::class, 'index'])->name('index');
    Route::post('/',  [AdminEmergencyContactController::class, 'store'])->name('store');
    Route::get('/{contact}',    [AdminEmergencyContactController::class, 'show'])->name('show');
    Route::put('/{contact}',    [AdminEmergencyContactController::class, 'update'])->name('update');
    Route::delete('/{contact}', [AdminEmergencyContactController::class, 'destroy'])->name('destroy');
    Route::patch('/{id}/restore', [AdminEmergencyContactController::class, 'restore'])->name('restore')
        ->whereNumber('id');

    Route::post('/{contact}/photos',                  [AdminEmergencyContactController::class, 'uploadPhotos'])->name('photos.store');
    Route::delete('/{contact}/photos/{photo}',        [AdminEmergencyContactController::class, 'deletePhoto'])->name('photos.destroy');
    Route::patch('/{contact}/photos/reorder',         [AdminEmergencyContactController::class, 'reorderPhotos'])->name('photos.reorder');
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
    Route::post('/{category}/image', [AdminCategoryController::class, 'uploadImage'])->name('image.store');
    Route::delete('/{category}/image', [AdminCategoryController::class, 'removeImage'])->name('image.destroy');
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

Route::get('/payment-settings',  [AdminPaymentSettingController::class, 'show'])->name('admin.payment-settings.show');
Route::put('/payment-settings',  [AdminPaymentSettingController::class, 'update'])->name('admin.payment-settings.update')
    ->middleware('ensure.super_admin');

Route::prefix('ticket-orders')->name('admin.ticket-orders.')->group(function (): void {
    Route::get('/stats',  [AdminTicketOrderController::class, 'stats'])->name('stats');
    Route::get('/export', [AdminTicketOrderController::class, 'export'])->name('export');
    Route::get('/',       [AdminTicketOrderController::class, 'index'])->name('index');
    Route::get('/{ticketOrder}', [AdminTicketOrderController::class, 'show'])->name('show');
    Route::post('/{ticketOrder}/confirm-payment', [AdminTicketOrderController::class, 'confirmPayment'])->name('confirmPayment')
        ->middleware('check.permission:payments.manage');
    Route::post('/{ticketOrder}/eticket',         [AdminTicketOrderController::class, 'uploadEticket'])->name('eticket.store')
        ->middleware('check.permission:payments.manage');
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
    Route::get('/',         [AdminFoodOrderController::class, 'index'])->name('index');
    Route::get('/export',   [AdminFoodOrderController::class, 'export'])->name('export');
    Route::get('/{foodOrder}', [AdminFoodOrderController::class, 'show'])->name('show');
    Route::post('/{foodOrder}/confirm-payment', [AdminFoodOrderController::class, 'confirmPayment'])->name('confirm-payment');
    Route::get('/{foodOrderId}/chat',  [\App\Http\Controllers\Api\Admin\V1\AdminOrderChatController::class, 'index'])->name('chat.index');
    Route::post('/{foodOrderId}/chat', [\App\Http\Controllers\Api\Admin\V1\AdminOrderChatController::class, 'store'])->name('chat.store');
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

// ── Home Card Routes (tap destinations) ───────────────────────────────────────
Route::prefix('home-card-routes')->name('admin.home-card-routes.')->middleware('check.permission:home_cards.manage')->group(function (): void {
    Route::get('/',  [AdminHomeCardRouteController::class, 'index'])->name('index');
    Route::post('/', [AdminHomeCardRouteController::class, 'store'])->name('store');
});

// ── Home Card Icons ────────────────────────────────────────────────────────────
Route::prefix('home-card-icons')->name('admin.home-card-icons.')->middleware('check.permission:home_cards.manage')->group(function (): void {
    Route::get('/',  [AdminHomeCardIconController::class, 'index'])->name('index');
    Route::post('/', [AdminHomeCardIconController::class, 'store'])->name('store');
});

// ── KYC Applications ──────────────────────────────────────────────────────────
Route::get('/merchants/kyc-badge',                              [AdminKycController::class, 'pendingCount']);
Route::post('/merchants',                                       [AdminMerchantCreateController::class, 'store']);
Route::get('/kyc-applications',                                 [AdminKycController::class, 'index']);
Route::get('/kyc-applications/{application}',                   [AdminKycController::class, 'show']);
Route::post('/kyc-applications/{application}/review',           [AdminKycController::class, 'review'])
    ->middleware('check.permission:admins.manage');

// ── Document Types ────────────────────────────────────────────────────────────
// ── App Config ────────────────────────────────────────────────────────────────
Route::get('/app-config', [AdminAppConfigController::class, 'show'])->name('admin.app-config.show');
Route::put('/app-config', [AdminAppConfigController::class, 'update'])->name('admin.app-config.update');

// ── System Health ─────────────────────────────────────────────────────────────
Route::get('/system-health', [AdminSystemHealthController::class, 'index'])
    ->name('admin.system-health.index')
    ->middleware('check.permission:admins.manage');

// ── In-App Alerts ─────────────────────────────────────────────────────────────
Route::prefix('in-app-alerts')->name('admin.in-app-alerts.')->group(function (): void {
    Route::get('/',    [AdminInAppAlertController::class, 'index'])->name('index');
    Route::post('/',   [AdminInAppAlertController::class, 'store'])->name('store');
    Route::put('/{id}',    [AdminInAppAlertController::class, 'update'])->name('update')->whereNumber('id');
    Route::delete('/{id}', [AdminInAppAlertController::class, 'destroy'])->name('destroy')->whereNumber('id');
    Route::patch('/{id}/activate',   [AdminInAppAlertController::class, 'activate'])->name('activate')->whereNumber('id');
    Route::patch('/{id}/deactivate', [AdminInAppAlertController::class, 'deactivate'])->name('deactivate')->whereNumber('id');
    Route::post('/{id}/image',   [AdminInAppAlertController::class, 'uploadImage'])->name('image.store')->whereNumber('id');
    Route::delete('/{id}/image', [AdminInAppAlertController::class, 'removeImage'])->name('image.destroy')->whereNumber('id');
});

// ── Maintenance ───────────────────────────────────────────────────────────────
// These routes are also excluded from maintenance mode in bootstrap/app.php so admins
// can disable maintenance without CLI access.
Route::prefix('maintenance')->name('admin.maintenance.')->group(function (): void {
    Route::get('/',        [AdminMaintenanceController::class, 'status'])->name('status');
    Route::post('/enable', [AdminMaintenanceController::class, 'enable'])->name('enable');
    Route::post('/disable',[AdminMaintenanceController::class, 'disable'])->name('disable');
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
