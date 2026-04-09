<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. Zero business logic. ≤20 lines/action.
 * Public endpoint — intentionally unauthenticated (throttle:api in middleware).
 */
class ServiceController extends Controller
{
    /**
     * GET /api/v1/services
     * List active services with their active types and prices.
     */
    public function index(): AnonymousResourceCollection
    {
        $services = Service::with(['types' => fn ($q) => $q->active()->orderBy('id')])
            ->active()
            ->orderBy('id')
            ->get();

        return ServiceResource::collection($services);
    }
}
