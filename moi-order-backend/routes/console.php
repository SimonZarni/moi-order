<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Send 90-day report reminders once daily at 09:00 Bangkok time (UTC+7 = 02:00 UTC).
Schedule::command('documents:send-ninety-day-reminders')
    ->dailyAt('02:00')
    ->timezone('Asia/Bangkok')
    ->withoutOverlapping()
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('documents:send-ninety-day-reminders failed');
    });
