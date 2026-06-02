<?php

use App\Jobs\QueueHeartbeatJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Expire food orders that have been pending (no restaurant response) for 30+ minutes.
Schedule::command('food-orders:expire-pending')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('food-orders:expire-pending failed');
    });

// Auto-complete delivered food orders after 10 minutes.
Schedule::command('food-orders:auto-complete')
    ->everyMinute()
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('food-orders:auto-complete failed');
    });

// Purge chat messages for orders completed more than 3 hours ago.
Schedule::command('order-chat:purge')
    ->everyFifteenMinutes()
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('order-chat:purge failed');
    });

// Send 90-day report reminders once daily at 09:00 Bangkok time (UTC+7 = 02:00 UTC).
Schedule::command('documents:send-ninety-day-reminders')
    ->dailyAt('02:00')
    ->timezone('Asia/Bangkok')
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('documents:send-ninety-day-reminders failed');
    });

// Pulse queue worker liveness — System Health dashboard reads this cache key.
Schedule::job(new QueueHeartbeatJob)->everyMinute()->onOneServer();
