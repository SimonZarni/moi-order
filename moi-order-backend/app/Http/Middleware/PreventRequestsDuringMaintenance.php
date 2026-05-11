<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    /**
     * URIs that are exempt from maintenance mode (503 gate).
     *
     * /api/health              — mobile app polls this to detect restoration.
     * /api/admin/v1/auth/login — admins can re-authenticate if their session
     *                            expired while maintenance was active.
     * /api/admin/v1/ping      — admin dashboard heartbeat to keep token alive.
     * /api/admin/v1/maintenance* — toggle endpoint so admins can turn
     *                              maintenance off without SSH + artisan up.
     */
    protected $except = [
        '/api/health',
        '/api/admin/v1/auth/login',
        '/api/admin/v1/ping',
        '/api/admin/v1/maintenance',
        '/api/admin/v1/maintenance/enable',
        '/api/admin/v1/maintenance/disable',
    ];
}
