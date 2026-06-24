<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\SafetyCategory;
use App\Http\Controllers\Controller;
use App\Http\Resources\SafetyLocationResource;
use App\Services\SafetyLocationService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SafetyLocationController extends Controller
{
    public function __construct(
        private readonly SafetyLocationService $service,
        private readonly FileStorageInterface  $storage,
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
}
