<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Enums\GoogleMatchStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminSaveGooglePlaceIdRequest;
use App\Http\Requests\Admin\AdminSearchGooglePlaceRequest;
use App\Http\Resources\Admin\AdminPlacePhotoResource;
use App\Http\Resources\PlaceImageResource;
use App\Models\Place;
use App\Models\PlacePhoto;
use App\Services\AdminGooglePhotoService;
use App\Contracts\GooglePlacesInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. Delegates all logic to services. ≤20 lines/action.
 */
class AdminGooglePlaceController extends Controller
{
    public function __construct(
        private readonly GooglePlacesInterface   $googlePlaces,
        private readonly AdminGooglePhotoService $photoService,
    ) {}

    /** POST /api/admin/v1/places/search-google */
    public function searchGoogle(AdminSearchGooglePlaceRequest $request): JsonResponse
    {
        $results = $this->googlePlaces->searchText(
            $request->string('name') . ' ' . $request->string('city'),
            0.0,   // No lat/lng from request — rely on textQuery alone
            0.0,
        );

        return response()->json(['data' => $results]);
    }

    /** PATCH /api/admin/v1/places/{place}/google-place-id */
    public function saveGooglePlaceId(AdminSaveGooglePlaceIdRequest $request, Place $place): JsonResponse
    {
        $place->update([
            'google_place_id'     => $request->string('google_place_id')->toString(),
            'google_match_status' => GoogleMatchStatus::Verified->value,
        ]);

        return response()->json(['data' => [
            'google_place_id'     => $place->google_place_id,
            'google_match_status' => $place->google_match_status,
        ]]);
    }

    /** GET /api/admin/v1/places/{place}/google-photos */
    public function getGooglePhotos(Place $place): AnonymousResourceCollection
    {
        $photos = $place->googlePhotos()->orderBy('display_order')->get();

        return AdminPlacePhotoResource::collection($photos);
    }

    /** POST /api/admin/v1/places/{place}/google-photos/fetch */
    public function fetchGooglePhotos(Place $place): JsonResponse
    {
        if (! $place->google_place_id) {
            return response()->json([
                'message' => 'Please set and verify a Google Place ID first.',
                'code'    => 'place.no_google_place_id',
            ], 422);
        }

        $photos = $this->photoService->fetchAndStore($place);

        return response()->json(['data' => AdminPlacePhotoResource::collection($photos)], 200);
    }

    /** POST /api/admin/v1/places/{place}/google-photos/{photo}/add-to-gallery */
    public function addToGallery(Place $place, PlacePhoto $photo): JsonResponse
    {
        $image = $this->photoService->addToGallery($place, $photo);

        return response()->json(['data' => new PlaceImageResource($image)], 201);
    }
}
