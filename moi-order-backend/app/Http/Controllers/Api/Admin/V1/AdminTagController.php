<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\AdminStoreTagDTO;
use App\DTOs\AdminUpdateTagDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreTagRequest;
use App\Http\Requests\Admin\AdminUpdateTagRequest;
use App\Http\Resources\Admin\AdminTagResource;
use App\Models\Tag;
use App\Services\AdminTagService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class AdminTagController extends Controller
{
    public function __construct(private readonly AdminTagService $service) {}

    /** GET /api/admin/v1/tags */
    public function index(Request $request): AnonymousResourceCollection
    {
        return AdminTagResource::collection(
            $this->service->index($request->integer('per_page', 20))
        );
    }

    /** POST /api/admin/v1/tags */
    public function store(AdminStoreTagRequest $request): JsonResponse
    {
        $tag = $this->service->store(AdminStoreTagDTO::fromRequest($request));

        return response()->json(['data' => new AdminTagResource($tag)], 201);
    }

    /** GET /api/admin/v1/tags/{tag} */
    public function show(Tag $tag): JsonResponse
    {
        return response()->json(['data' => new AdminTagResource($this->service->show($tag))]);
    }

    /** PUT /api/admin/v1/tags/{tag} */
    public function update(AdminUpdateTagRequest $request, Tag $tag): JsonResponse
    {
        $updated = $this->service->update($tag, AdminUpdateTagDTO::fromRequest($request));

        return response()->json(['data' => new AdminTagResource($updated)]);
    }

    /** DELETE /api/admin/v1/tags/{tag} */
    public function destroy(Tag $tag): JsonResponse
    {
        $this->service->destroy($tag);

        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/tags/{id}/restore — withTrashed lookup required */
    public function restore(int $id): JsonResponse
    {
        $tag = Tag::withTrashed()->findOrFail($id);
        $restored = $this->service->restore($tag);

        return response()->json(['data' => new AdminTagResource($restored)]);
    }
}
