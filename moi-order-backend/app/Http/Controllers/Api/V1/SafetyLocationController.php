<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\SafetyCategory;
use App\Http\Controllers\Controller;
use App\Http\Resources\SafetyLocationResource;
use App\Models\SafetyLocation;
use App\Services\SafetyLocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SafetyLocationController extends Controller
{
    public function __construct(
        private readonly SafetyLocationService $service,
    ) {}

    /** GET /api/v1/safety-locations — intentionally public */
    public function index(Request $request): AnonymousResourceCollection
    {
        $category = $request->filled('category')
            ? SafetyCategory::tryFrom($request->string('category')->toString())
            : null;

        $paginator = $this->service->list(
            category: $category,
            search:   $request->string('search')->toString() ?: null,
            perPage:  min($request->integer('per_page', 50), 100),
        );

        return SafetyLocationResource::collection($paginator)->additional([
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
            ],
        ]);
    }

    /** GET /api/v1/safety-locations/{id} — intentionally public */
    public function show(int $id): JsonResponse
    {
        $location = SafetyLocation::findOrFail($id);

        return response()->json(['data' => new SafetyLocationResource($location)]);
    }
}
