<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Services\Admin\SystemHealthService;
use Illuminate\Http\JsonResponse;

class AdminSystemHealthController extends Controller
{
    public function __construct(
        private readonly SystemHealthService $health,
    ) {}

    /** GET /api/admin/v1/system-health */
    public function index(): JsonResponse
    {
        return response()->json(['data' => $this->health->check()]);
    }
}
