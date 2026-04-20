<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminStoreServiceDTO;
use App\DTOs\AdminStoreServiceTypeDTO;
use App\DTOs\AdminUpdateServiceDTO;
use App\DTOs\AdminUpdateServiceTypeDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreServiceRequest;
use App\Http\Requests\Admin\AdminStoreServiceTypeRequest;
use App\Http\Requests\Admin\AdminUpdateServiceRequest;
use App\Http\Requests\Admin\AdminUpdateServiceTypeRequest;
use App\Http\Resources\Admin\AdminServiceResource;
use App\Http\Resources\Admin\AdminServiceTypeResource;
use App\Models\Service;
use App\Models\ServiceType;
use App\Services\AdminServiceService;
use App\Services\AdminServiceTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class AdminServiceController extends Controller
{
    public function __construct(
        private readonly AdminServiceService     $serviceService,
        private readonly AdminServiceTypeService $typeService,
    ) {}

    /** GET /api/admin/v1/services */
    public function index(): AnonymousResourceCollection
    {
        return AdminServiceResource::collection($this->serviceService->index());
    }

    /** GET /api/admin/v1/services/{service} */
    public function show(Service $service): JsonResponse
    {
        return response()->json(['data' => new AdminServiceResource($service)]);
    }

    /** POST /api/admin/v1/services */
    public function store(AdminStoreServiceRequest $request): JsonResponse
    {
        $service = $this->serviceService->store(AdminStoreServiceDTO::fromRequest($request));

        return response()->json(['data' => new AdminServiceResource($service)], 201);
    }

    /** PUT /api/admin/v1/services/{service} */
    public function update(AdminUpdateServiceRequest $request, Service $service): JsonResponse
    {
        $updated = $this->serviceService->update($service, AdminUpdateServiceDTO::fromRequest($request));

        return response()->json(['data' => new AdminServiceResource($updated)]);
    }

    /** DELETE /api/admin/v1/services/{service} */
    public function destroy(Service $service): JsonResponse
    {
        $this->serviceService->destroy($service);

        return response()->json(null, 204);
    }

    /** GET /api/admin/v1/services/{service}/types */
    public function types(Service $service): AnonymousResourceCollection
    {
        return AdminServiceTypeResource::collection($this->typeService->index($service));
    }

    /** POST /api/admin/v1/services/{service}/types */
    public function storeType(AdminStoreServiceTypeRequest $request, Service $service): JsonResponse
    {
        $type = $this->typeService->store($service, AdminStoreServiceTypeDTO::fromRequest($request));

        return response()->json(['data' => new AdminServiceTypeResource($type)], 201);
    }

    /** PUT /api/admin/v1/services/{service}/types/{type} */
    public function updateType(AdminUpdateServiceTypeRequest $request, Service $service, ServiceType $type): JsonResponse
    {
        $updated = $this->typeService->update($type, AdminUpdateServiceTypeDTO::fromRequest($request));

        return response()->json(['data' => new AdminServiceTypeResource($updated)]);
    }

    /** DELETE /api/admin/v1/services/{service}/types/{type} */
    public function destroyType(Service $service, ServiceType $type): JsonResponse
    {
        $this->typeService->destroy($type);

        return response()->json(null, 204);
    }
}
