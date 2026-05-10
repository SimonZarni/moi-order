<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class AdminMaintenanceController extends Controller
{
    public function status(): JsonResponse
    {
        return response()->json([
            'active' => app()->isDownForMaintenance(),
        ]);
    }

    public function enable(Request $request): JsonResponse
    {
        if (app()->isDownForMaintenance()) {
            return response()->json(['message' => 'Already in maintenance mode.', 'active' => true]);
        }

        $secret = config('app.maintenance_secret', 'trusted-brothers-2026');

        Artisan::call('down', [
            '--secret'  => $secret,
            '--retry'   => 3600,
            '--render'  => 'errors.503',
        ]);

        Log::info('Maintenance mode enabled', ['admin_id' => $request->user()?->id]);

        return response()->json([
            'active'  => true,
            'message' => 'Maintenance mode enabled.',
            'secret'  => $secret,
        ]);
    }

    public function disable(Request $request): JsonResponse
    {
        if (!app()->isDownForMaintenance()) {
            return response()->json(['message' => 'App is already live.', 'active' => false]);
        }

        Artisan::call('up');

        Log::info('Maintenance mode disabled', ['admin_id' => $request->user()?->id]);

        return response()->json([
            'active'  => false,
            'message' => 'App is back online.',
        ]);
    }
}
