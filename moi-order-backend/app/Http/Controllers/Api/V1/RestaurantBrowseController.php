<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Contracts\FileStorageInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\RestaurantBrowseRequest;
use App\Http\Resources\RestaurantResource;
use App\Models\Restaurant;
use App\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantBrowseController extends Controller
{
    public function __construct(
        private readonly RestaurantService   $restaurantService,
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/v1/restaurants */
    public function index(RestaurantBrowseRequest $request): JsonResponse
    {
        $lat    = $request->filled('lat') ? (float) $request->input('lat') : null;
        $lng    = $request->filled('lng') ? (float) $request->input('lng') : null;
        $search = $request->string('search')->trim()->toString();

        $restaurants = $this->restaurantService->browse($lat, $lng, $search ?: null);

        return response()->json([
            'data' => collect($restaurants->items())
                ->map(fn ($r) => (new RestaurantResource($r, $this->storage))->resolve($request))
                ->values(),
            'meta' => [
                'current_page' => $restaurants->currentPage(),
                'last_page'    => $restaurants->lastPage(),
                'per_page'     => $restaurants->perPage(),
                'total'        => $restaurants->total(),
            ],
        ]);
    }

    /** GET /api/v1/restaurants/{id} */
    public function show(Request $request, int $id): JsonResponse
    {
        $restaurant = Restaurant::with([
            'openingHours',
            'photos',
            'menuCategories.menuItems' => fn ($q) => $q->with('optionGroups.options')->visibleToCustomer(),
        ])->findOrFail($id);

        return response()->json(['data' => new RestaurantResource($restaurant, $this->storage)]);
    }
}
