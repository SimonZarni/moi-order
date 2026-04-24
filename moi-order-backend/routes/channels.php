<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Broadcast;

/*
 * Principle: Security — private channels verified server-side before any event is delivered.
 * The authenticated user may only subscribe to their own notification channel.
 */
Broadcast::channel('App.Models.User.{id}', function ($user, int $id): bool {
    return (int) $user->id === $id;
});
