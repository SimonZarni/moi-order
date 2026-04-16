<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminStorePlaceDTO;
use App\DTOs\AdminUpdatePlaceDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminPlaceIndexRequest;
use App\Http\Requests\Admin\AdminReorderPlaceImagesRequest;
use App\Http\Requests\Admin\AdminStorePlaceRequest;
use App\Http\Requests\Admin\AdminUpdatePlaceRequest;
use App\Http\Requests\Admin\AdminUploadPlaceImagesRequest;
use App\Http\Resources\Admin\AdminPlaceResource;
use App\Http\Resources\PlaceImageResource;
use App\Models\Place;
use App\Models\PlaceImage;
use App\Services\AdminPlaceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class AdminPlaceController extends Controller
{
    public function __construct(private readonly AdminPlaceService $service) {}

    /** GET /api/admin/v1/places */
    public function index(AdminPlaceIndexRequest $request): AnonymousResourceCollection
    {
        return AdminPlaceResource::collection($this->service->index($request));
    }

    /** POST /api/admin/v1/places */
    public function store(AdminStorePlaceRequest $request): JsonResponse
    {
        $place = $this->service->store(AdminStorePlaceDTO::fromRequest($request));

        return response()->json(['data' => new AdminPlaceResource($place)], 201);
    }

    /** GET /api/admin/v1/places/{place} */
    public function show(Place $place): JsonResponse
    {
        return response()->json(['data' => new AdminPlaceResource($this->service->show($place))]);
    }

    /** PUT /api/admin/v1/places/{place} */
    public function update(AdminUpdatePlaceRequest $request, Place $place): JsonResponse
    {
        $updated = $this->service->update($place, AdminUpdatePlaceDTO::fromRequest($request));

        return response()->json(['data' => new AdminPlaceResource($updated)]);
    }

    /** DELETE /api/admin/v1/places/{place} */
    public function destroy(Place $place): JsonResponse
    {
        $this->service->destroy($place);

        return response()->json(null, 204);
    }

    /** POST /api/admin/v1/places/{place}/images */
    public function uploadImages(AdminUploadPlaceImagesRequest $request, Place $place): JsonResponse
    {
        $images = $this->service->uploadImages($place, $request);

        return response()->json(['data' => PlaceImageResource::collection($images)], 201);
    }

    /** DELETE /api/admin/v1/places/{place}/images/{image} */
    public function deleteImage(Place $place, PlaceImage $image): JsonResponse
    {
        $this->service->deleteImage($image);

        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/places/{place}/images/reorder */
    public function reorderImages(AdminReorderPlaceImagesRequest $request, Place $place): JsonResponse
    {
        $images = $this->service->reorderImages($place, $request);

        return response()->json(['data' => PlaceImageResource::collection($images)]);
    }
}
