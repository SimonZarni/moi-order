<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// intentionally public
Route::get('/health', fn () => response()->json(['status' => 'ok', 'version' => 'v1']));
