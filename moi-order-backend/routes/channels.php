<?php

declare(strict_types=1);

use App\Models\FoodOrder;
use Illuminate\Support\Facades\Broadcast;

/*
 * Principle: Security — private channels verified server-side before any event is delivered.
 */

// In-app notification bell (UserNotificationReceived broadcasts here).
Broadcast::channel('App.Models.User.{id}', function ($user, int $id): bool {
    return (int) $user->id === $id;
});

// Food-order status updates (FoodOrderStatusUpdated broadcasts here).
Broadcast::channel('user.{id}', function ($user, int $id): bool {
    return (int) $user->id === $id;
});

// Order chat — customer who owns the order, or any authenticated admin.
Broadcast::channel('order.{foodOrderId}', function ($user, int $foodOrderId): bool {
    // Admin token carries the 'admin' ability.
    if ($user->currentAccessToken()?->can('admin')) {
        return true;
    }

    // Customer: must own the order.
    return FoodOrder::forUser($user->id)->where('id', $foodOrderId)->exists();
});
