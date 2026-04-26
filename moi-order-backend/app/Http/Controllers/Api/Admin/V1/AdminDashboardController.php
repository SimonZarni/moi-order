<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Services\AdminDashboardService;
use Illuminate\Http\JsonResponse;

/**
 * Principle: SRP — HTTP layer only. Single action, single service call.
 */
class AdminDashboardController extends Controller
{
    public function __construct(private readonly AdminDashboardService $service) {}

    /** GET /api/admin/v1/dashboard */
    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->service->get()]);
    }
}
