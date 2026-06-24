<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
use App\Enums\SafetyCategory;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSafetyLocationRequest;
use App\Http\Requests\Admin\UpdateSafetyLocationRequest;
use App\Http\Resources\SafetyLocationResource;
use App\Models\SafetyLocation;
use App\Services\SafetyLocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AdminSafetyLocationController extends Controller
{
    public function __construct(
        private readonly SafetyLocationService $service,
        private readonly FileStorageInterface  $storage,
    ) {}

    /** GET /api/admin/v1/safety-locations */
    public function index(Request $request): AnonymousResourceCollection
    {
        $category = $request->filled('category')
            ? SafetyCategory::tryFrom($request->string('category')->toString())
            : null;

        $paginator = $this->service->list(
            category: $category,
            search:   $request->string('search')->toString() ?: null,
            perPage:  $request->integer('per_page', 20),
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

    /** POST /api/admin/v1/safety-locations */
    public function store(StoreSafetyLocationRequest $request): JsonResponse
    {
        $location = $this->service->create($request->validated());

        return response()->json(['data' => new SafetyLocationResource($location, $this->storage)], 201);
    }

    /** GET /api/admin/v1/safety-locations/{id} */
    public function show(int $id): JsonResponse
    {
        $location = SafetyLocation::findOrFail($id);

        return response()->json(['data' => new SafetyLocationResource($location, $this->storage)]);
    }

    /** PUT /api/admin/v1/safety-locations/{id} */
    public function update(UpdateSafetyLocationRequest $request, int $id): JsonResponse
    {
        $location = SafetyLocation::findOrFail($id);
        $updated  = $this->service->update($location, $request->validated());

        return response()->json(['data' => new SafetyLocationResource($updated, $this->storage)]);
    }

    /** DELETE /api/admin/v1/safety-locations/{id} */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete(SafetyLocation::findOrFail($id));

        return response()->json(null, 204);
    }

    /** POST /api/admin/v1/safety-locations/{id}/photos */
    public function addPhoto(Request $request, int $id): JsonResponse
    {
        $request->validate(['photo' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120']]);
        $location = SafetyLocation::findOrFail($id);
        $updated  = $this->service->addPhoto($location, $request->file('photo'));

        return response()->json(['data' => new SafetyLocationResource($updated, $this->storage)]);
    }

    /** DELETE /api/admin/v1/safety-locations/{id}/photos/{index} */
    public function removePhoto(int $id, int $index): JsonResponse
    {
        $location = SafetyLocation::findOrFail($id);
        $updated  = $this->service->removePhoto($location, $index);

        return response()->json(['data' => new SafetyLocationResource($updated, $this->storage)]);
    }

    /** GET /api/admin/v1/safety-locations/export */
    public function export(Request $request): BinaryFileResponse
    {
        $category = $request->filled('category')
            ? SafetyCategory::tryFrom($request->string('category')->toString())
            : null;

        return $this->service->export($category);
    }

    /** POST /api/admin/v1/safety-locations/import */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file'     => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
            'category' => ['nullable', 'string'],
        ]);

        $defaultCategory = $request->filled('category')
            ? SafetyCategory::tryFrom($request->string('category')->toString())
            : null;

        $count = $this->service->import($request->file('file'), $defaultCategory);

        return response()->json(['message' => "{$count} records imported.", 'count' => $count]);
    }
}
