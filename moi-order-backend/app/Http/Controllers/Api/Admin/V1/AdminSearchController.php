<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Http\Controllers\Controller;
use App\Services\AdminSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Principle: SRP — HTTP layer only. Delegates all logic to AdminSearchService.
 */
class AdminSearchController extends Controller
{
    public function __construct(private readonly AdminSearchService $service) {}

    /** GET /api/admin/v1/search?q= */
    public function __invoke(Request $request): JsonResponse
    {
        $query = $request->string('q')->toString();

        return response()->json(['data' => $this->service->search($query)]);
    }
}
