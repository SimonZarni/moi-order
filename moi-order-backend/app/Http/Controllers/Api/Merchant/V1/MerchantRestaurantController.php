<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Exceptions\DomainException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\StoreRestaurantRequest;
use App\Http\Requests\Merchant\UpdateRestaurantRequest;
use App\Http\Resources\RestaurantResource;
use App\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MerchantRestaurantController extends Controller
{
    public function __construct(
        private readonly RestaurantService   $restaurantService,
        private readonly FileStorageInterface $storage,
    ) {}

    /** GET /api/merchant/v1/restaurant */
    public function show(Request $request): JsonResponse
    {
        $restaurant = $this->restaurantService->getForMerchant($request->user());

        if ($restaurant === null) {
            return response()->json(['data' => null]);
        }

        return response()->json(['data' => new RestaurantResource($restaurant, $this->storage)]);
    }

    /** POST /api/merchant/v1/restaurant */
    public function store(StoreRestaurantRequest $request): JsonResponse
    {
        if ($request->user()->restaurant()->exists()) {
            throw new DomainException('restaurant.already_exists', 409);
        }

        $restaurant = $this->restaurantService->create($request->user(), $request->validated());

        return response()->json(['data' => new RestaurantResource($restaurant, $this->storage)], 201);
    }

    /** PUT /api/merchant/v1/restaurant */
    public function update(UpdateRestaurantRequest $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();

        $restaurant = $this->restaurantService->update($restaurant, $request->validated());

        return response()->json(['data' => new RestaurantResource($restaurant, $this->storage)]);
    }
}
