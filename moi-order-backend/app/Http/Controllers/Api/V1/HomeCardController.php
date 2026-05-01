<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomeCardResource;
use App\Services\HomeCardService;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HomeCardController extends Controller
{
    public function __construct(private readonly HomeCardService $service) {}

    /** GET /api/v1/home-cards — returns active cards ordered by position */
    public function index(): AnonymousResourceCollection
    {
        return HomeCardResource::collection($this->service->indexForUser());
    }
}
