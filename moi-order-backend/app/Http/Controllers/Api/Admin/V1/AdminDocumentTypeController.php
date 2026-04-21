<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminStoreDocumentTypeDTO;
use App\DTOs\AdminUpdateDocumentTypeDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreDocumentTypeRequest;
use App\Http\Requests\Admin\AdminUpdateDocumentTypeRequest;
use App\Http\Resources\Admin\AdminDocumentTypeResource;
use App\Models\DocumentType;
use App\Services\AdminDocumentTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminDocumentTypeController extends Controller
{
    public function __construct(private readonly AdminDocumentTypeService $service) {}

    /** GET /api/admin/v1/document-types?all=1 for dropdown, paginated otherwise */
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        if ($request->boolean('all')) {
            return response()->json(['data' => AdminDocumentTypeResource::collection($this->service->all())]);
        }

        return AdminDocumentTypeResource::collection(
            $this->service->index($request->integer('per_page', 20))
        );
    }

    /** POST /api/admin/v1/document-types */
    public function store(AdminStoreDocumentTypeRequest $request): JsonResponse
    {
        $documentType = $this->service->store(AdminStoreDocumentTypeDTO::fromRequest($request));

        return response()->json(['data' => new AdminDocumentTypeResource($documentType)], 201);
    }

    /** PUT /api/admin/v1/document-types/{documentType} */
    public function update(AdminUpdateDocumentTypeRequest $request, DocumentType $documentType): JsonResponse
    {
        $updated = $this->service->update($documentType, AdminUpdateDocumentTypeDTO::fromRequest($request));

        return response()->json(['data' => new AdminDocumentTypeResource($updated)]);
    }

    /** DELETE /api/admin/v1/document-types/{documentType} */
    public function destroy(DocumentType $documentType): JsonResponse
    {
        $this->service->destroy($documentType);

        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/document-types/{id}/restore */
    public function restore(int $id): JsonResponse
    {
        $restored = $this->service->restore($id);

        return response()->json(['data' => new AdminDocumentTypeResource($restored)]);
    }
}
