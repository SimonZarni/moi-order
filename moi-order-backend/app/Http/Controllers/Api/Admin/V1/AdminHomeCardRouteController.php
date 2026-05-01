<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\StoreHomeCardRouteDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHomeCardRouteRequest;
use App\Http\Resources\Admin\AdminHomeCardRouteResource;
use App\Services\HomeCardRouteService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminHomeCardRouteController extends Controller
{
    public function __construct(private readonly HomeCardRouteService $service) {}

    /** GET /api/admin/v1/home-card-routes */
    public function index(): AnonymousResourceCollection
    {
        return AdminHomeCardRouteResource::collection($this->service->index());
    }

    /** POST /api/admin/v1/home-card-routes */
    public function store(StoreHomeCardRouteRequest $request): JsonResponse
    {
        $route = $this->service->store(StoreHomeCardRouteDTO::fromRequest($request));

        return response()->json(['data' => new AdminHomeCardRouteResource($route)], 201);
    }
}
