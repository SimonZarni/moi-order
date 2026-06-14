<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Merchant\V1;

use App\Contracts\FileStorageInterface;
use App\Exceptions\DomainException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Merchant\StoreRestaurantRequest;
use App\Http\Requests\Merchant\UpdateRestaurantRequest;
use App\Http\Requests\Merchant\UpdateRestaurantStatusRequest;
use App\Http\Resources\RestaurantResource;
use App\Enums\RestaurantStatus;
use App\Models\KycApplication;
use App\Models\RestaurantPhoto;
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
            $kyc = KycApplication::where('user_id', $request->user()->id)->latest()->first();
            return response()->json([
                'data'    => null,
                'prefill' => $kyc ? [
                    'name'    => $kyc->business_name,
                    'address' => $kyc->business_address,
                    'phone'   => $kyc->business_phone,
                ] : null,
            ]);
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

    /** PATCH /api/merchant/v1/restaurant/status */
    public function updateStatus(UpdateRestaurantStatusRequest $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $status     = RestaurantStatus::from($request->string('status')->toString());
        $restaurant = $this->restaurantService->setStatusOverride($restaurant, $status);

        return response()->json(['data' => new RestaurantResource($restaurant, $this->storage)]);
    }

    /** POST /api/merchant/v1/restaurant/cover_photo */
    public function uploadCoverPhoto(Request $request): JsonResponse
    {
        // 'image' rule uses getimagesize() which does not support HEIC/HEIF — omitted intentionally.
        $request->validate(['photo' => ['required', 'file', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:5120']]);
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $restaurant = $this->restaurantService->update($restaurant, ['cover_photo' => $request->file('photo')]);
        return response()->json(['data' => new RestaurantResource($restaurant, $this->storage)]);
    }

    /** DELETE /api/merchant/v1/restaurant/cover_photo */
    public function removeCoverPhoto(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        if ($restaurant->cover_photo_path !== null) {
            $this->storage->delete($restaurant->cover_photo_path);
            $restaurant->update(['cover_photo_path' => null]);
        }
        return response()->json(['data' => new RestaurantResource($restaurant->fresh(), $this->storage)]);
    }

    /** POST /api/merchant/v1/restaurant/logo */
    public function uploadLogo(Request $request): JsonResponse
    {
        // 'image' rule uses getimagesize() which does not support HEIC/HEIF — omitted intentionally.
        $request->validate(['photo' => ['required', 'file', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:5120']]);
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $restaurant = $this->restaurantService->update($restaurant, ['logo' => $request->file('photo')]);
        return response()->json(['data' => new RestaurantResource($restaurant, $this->storage)]);
    }

    /** DELETE /api/merchant/v1/restaurant/logo */
    public function removeLogo(Request $request): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        if ($restaurant->logo_path !== null) {
            $this->storage->delete($restaurant->logo_path);
            $restaurant->update(['logo_path' => null]);
        }
        return response()->json(['data' => new RestaurantResource($restaurant->fresh(), $this->storage)]);
    }

    /** POST /api/merchant/v1/restaurant/photos */
    public function uploadPhoto(Request $request): JsonResponse
    {
        // 'image' rule uses getimagesize() which does not support HEIC/HEIF — omitted intentionally.
        $request->validate(['photo' => ['required', 'file', 'mimes:jpeg,jpg,png,webp,heic,heif', 'max:5120']]);
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $this->restaurantService->addPhoto($restaurant, $request->file('photo'));
        return response()->json(['data' => new RestaurantResource($restaurant->fresh(['photos']), $this->storage)], 201);
    }

    /** DELETE /api/merchant/v1/restaurant/photos/{photoId} */
    public function removePhoto(Request $request, int $photoId): JsonResponse
    {
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $photo = RestaurantPhoto::where('restaurant_id', $restaurant->id)->findOrFail($photoId);
        $this->restaurantService->deletePhoto($photo);
        return response()->json(['data' => new RestaurantResource($restaurant->fresh(['photos']), $this->storage)]);
    }

    /** PATCH /api/merchant/v1/restaurant/photos/reorder */
    public function reorderPhotos(Request $request): JsonResponse
    {
        $validated = $request->validate(['ids' => ['required', 'array'], 'ids.*' => ['integer']]);
        $restaurant = $request->user()->restaurant()->firstOrFail();
        $this->restaurantService->reorderPhotos($restaurant, $validated['ids']);
        return response()->json(['data' => new RestaurantResource($restaurant->fresh(['photos']), $this->storage)]);
    }
}
