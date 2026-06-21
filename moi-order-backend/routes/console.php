<?php

use App\Jobs\QueueHeartbeatJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Expire food orders that have been pending (no restaurant response) for 60+ minutes.
Schedule::command('food-orders:expire-pending')
    ->everyFiveMinutes()
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('food-orders:expire-pending failed');
    });

// Auto-open / auto-close restaurants based on their merchant-configured opening hours.
Schedule::command('restaurants:auto-open-close')
    ->everyMinute()
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('restaurants:auto-open-close failed');
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

// Auto-close restaurants that are Open but still missing required menu items (Popular Picks / Recommendations).
// Runs daily at 03:00 Bangkok time (UTC+7 = 20:00 UTC) — gives admin-forced openings a 24-hour grace window.
Schedule::command('restaurants:enforce-menu-rules')
    ->dailyAt('20:00')
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('restaurants:enforce-menu-rules scheduled run failed');
    });

// Send 90-day report reminders once daily at 09:00 Bangkok time (UTC+7 = 02:00 UTC).
Schedule::command('documents:send-ninety-day-reminders')
    ->dailyAt('02:00')
    ->timezone('Asia/Bangkok')
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('documents:send-ninety-day-reminders failed');
    });

// Generate daily cashout invoices at 00:05 Bangkok time (UTC+7 = 17:05 UTC previous day).
// Targets yesterday's completed orders; idempotent if re-run.
Schedule::command('invoices:generate-daily')
    ->dailyAt('17:05')
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('invoices:generate-daily scheduled run failed');
    });

// Pulse queue worker liveness — System Health dashboard reads this cache key.
Schedule::job(new QueueHeartbeatJob)->everyMinute()->onOneServer();
