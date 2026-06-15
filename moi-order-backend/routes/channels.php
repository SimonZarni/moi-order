<?php

declare(strict_types=1);

use App\Models\FoodOrder;
use Illuminate\Support\Facades\Broadcast;

/*
 * Principle: Security — private channels verified server-side before any event is delivered.
 */

// In-app notification bell — user-facing (UserNotificationReceived broadcasts here).
// Channel uses uuid so the name matches what UserResource/AdminUserResource expose as "id".
Broadcast::channel('App.Models.User.{uuid}', function ($user, string $uuid): bool {
    return $user->uuid === $uuid;
});

// Admin notification bell — admin-only (AdminNotificationReceived broadcasts here).
// Separate channel so mobile app clients subscribed to App.Models.User.{uuid} never
// receive signals for admin-only notifications, even for dual-role users.
// Extra is_admin guard prevents a non-admin user who knows a UUID from subscribing.
Broadcast::channel('App.Admin.User.{uuid}', function ($user, string $uuid): bool {
    return $user->uuid === $uuid && $user->is_admin === true;
});

// Food-order status updates (FoodOrderStatusUpdated broadcasts here).
Broadcast::channel('user.{uuid}', function ($user, string $uuid): bool {
    return $user->uuid === $uuid;
});

// Presence channel — any authenticated user can join; their id/name is shared with subscribers.
// Admin dashboard subscribes to see who's currently online.
Broadcast::channel('presence-online-users', function ($user): array|false {
    if ($user === null) {
        return false;
    }

    return ['id' => $user->id, 'name' => $user->name];
});

// Merchant private channel — real-time dashboard (NewFoodOrder broadcasts here).
// Only the owning merchant may subscribe to their own channel.
// Middleware (auth:sanctum + abilities:merchant) already enforces token validity,
// so we only need to verify the user owns this merchant channel by ID.
Broadcast::channel('merchant.{merchantId}', function ($user, string $merchantId): bool {
    return (int) $user->id === (int) $merchantId;
});

// Order chat + status updates — customer who owns the order, merchant who received it, or any admin.
// Channel name uses the order UUID (not integer PK) so it matches HasUuid::getRouteKeyName().
Broadcast::channel('order.{foodOrderUuid}', function ($user, string $foodOrderUuid): bool {
    // Admin token: can('admin') works here because admins auth via a separate guard where
    // currentAccessToken() is properly populated.
    if ($user->currentAccessToken()?->can('admin')) {
        return true;
    }

    // Merchant: data-level check only — do NOT use currentAccessToken()?->can('merchant')
    // because currentAccessToken() returns null in the broadcasting context for Sanctum
    // merchant tokens (same bug fixed on the merchant.{merchantId} channel).
    if ($user->restaurant()
        ->whereHas('foodOrders', fn ($q) => $q->where('uuid', $foodOrderUuid))
        ->exists()
    ) {
        return true;
    }

    // Customer: must own the order.
    return FoodOrder::forUser($user->id)->where('uuid', $foodOrderUuid)->exists();
});
