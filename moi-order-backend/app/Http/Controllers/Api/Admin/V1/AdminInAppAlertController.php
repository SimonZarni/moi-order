<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\InAppAlertDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInAppAlertRequest;
use App\Http\Requests\Admin\UpdateInAppAlertRequest;
use App\Http\Requests\Admin\UploadInAppAlertImageRequest;
use App\Http\Resources\Admin\InAppAlertResource;
use App\Models\InAppAlert;
use App\Services\InAppAlertService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * SRP: HTTP layer only. ≤20 lines/action. One service call per action.
 * Security: auth:sanctum + AdminAuthenticate on every route via group middleware.
 */
class AdminInAppAlertController extends Controller
{
    public function __construct(
        private readonly InAppAlertService $service,
    ) {}

    /** GET /api/admin/v1/in-app-alerts */
    public function index(): AnonymousResourceCollection
    {
        $alerts = InAppAlert::with('creator')->orderByDesc('created_at')->get();

        return InAppAlertResource::collection($alerts);
    }

    /** POST /api/admin/v1/in-app-alerts */
    public function store(StoreInAppAlertRequest $request): JsonResource
    {
        $alert = $this->service->store(InAppAlertDTO::fromRequest($request), $request->user()->id);

        return new InAppAlertResource($alert->load('creator'));
    }

    /** PUT /api/admin/v1/in-app-alerts/{id} */
    public function update(UpdateInAppAlertRequest $request, int $id): JsonResource
    {
        $alert = InAppAlert::findOrFail($id);
        $alert = $this->service->update($alert, InAppAlertDTO::fromRequest($request));

        return new InAppAlertResource($alert->load('creator'));
    }

    /** PATCH /api/admin/v1/in-app-alerts/{id}/activate */
    public function activate(Request $request, int $id): JsonResource
    {
        $alert = InAppAlert::findOrFail($id);
        $alert = $this->service->activate($alert);

        return new InAppAlertResource($alert->load('creator'));
    }

    /** PATCH /api/admin/v1/in-app-alerts/{id}/deactivate */
    public function deactivate(Request $request, int $id): JsonResource
    {
        $alert = InAppAlert::findOrFail($id);
        $alert = $this->service->deactivate($alert);

        return new InAppAlertResource($alert->load('creator'));
    }

    /** POST /api/admin/v1/in-app-alerts/{id}/image */
    public function uploadImage(UploadInAppAlertImageRequest $request, int $id): JsonResource
    {
        $alert = InAppAlert::findOrFail($id);
        $alert = $this->service->uploadImage($alert, $request->file('image'));

        return new InAppAlertResource($alert->load('creator'));
    }

    /** DELETE /api/admin/v1/in-app-alerts/{id}/image */
    public function removeImage(Request $request, int $id): JsonResource
    {
        $alert = InAppAlert::findOrFail($id);
        $alert = $this->service->removeImage($alert);

        return new InAppAlertResource($alert->load('creator'));
    }

    /** DELETE /api/admin/v1/in-app-alerts/{id} */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $alert = InAppAlert::findOrFail($id);
        $this->service->delete($alert);

        return response()->json(null, 204);
    }
}
