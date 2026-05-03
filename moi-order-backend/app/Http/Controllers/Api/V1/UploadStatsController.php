<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadStatsController extends Controller
{
    public function __construct(private readonly DocumentService $service) {}

    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->service->getUploadStats($request->user()),
        ]);
    }
}
