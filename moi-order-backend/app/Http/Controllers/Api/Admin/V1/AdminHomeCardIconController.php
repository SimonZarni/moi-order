<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\StoreHomeCardIconDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHomeCardIconRequest;
use App\Http\Resources\Admin\AdminHomeCardIconResource;
use App\Services\HomeCardIconService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminHomeCardIconController extends Controller
{
    public function __construct(private readonly HomeCardIconService $service) {}

    /** GET /api/admin/v1/home-card-icons */
    public function index(): AnonymousResourceCollection
    {
        return AdminHomeCardIconResource::collection($this->service->index());
    }

    /** POST /api/admin/v1/home-card-icons */
    public function store(StoreHomeCardIconRequest $request): JsonResponse
    {
        $icon = $this->service->store(StoreHomeCardIconDTO::fromRequest($request));

        return response()->json(['data' => new AdminHomeCardIconResource($icon)], 201);
    }
}
