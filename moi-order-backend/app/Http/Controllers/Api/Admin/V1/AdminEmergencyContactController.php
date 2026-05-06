<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\DTOs\StoreEmergencyContactDTO;
use App\DTOs\UpdateEmergencyContactDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreEmergencyContactRequest;
use App\Http\Requests\Admin\AdminUpdateEmergencyContactRequest;
use App\Http\Resources\Admin\AdminEmergencyContactResource;
use App\Http\Resources\EmergencyContactPhotoResource;
use App\Models\EmergencyContact;
use App\Models\EmergencyContactPhoto;
use App\Services\EmergencyContactService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Principle: SRP — HTTP layer only. ≤20 lines/action. One service call per action.
 */
class AdminEmergencyContactController extends Controller
{
    public function __construct(private readonly EmergencyContactService $service) {}

    /** GET /api/admin/v1/emergency/contacts */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = min($request->integer('per_page', 20), 100);
        return AdminEmergencyContactResource::collection($this->service->indexForAdmin($perPage));
    }

    /** POST /api/admin/v1/emergency/contacts */
    public function store(AdminStoreEmergencyContactRequest $request): JsonResponse
    {
        $contact = $this->service->store(StoreEmergencyContactDTO::fromRequest($request));
        return response()->json(['data' => new AdminEmergencyContactResource($contact)], 201);
    }

    /** GET /api/admin/v1/emergency/contacts/{contact} */
    public function show(EmergencyContact $contact): JsonResponse
    {
        $contact->loadMissing(['photos']);
        return response()->json(['data' => new AdminEmergencyContactResource($contact)]);
    }

    /** PUT /api/admin/v1/emergency/contacts/{contact} */
    public function update(AdminUpdateEmergencyContactRequest $request, EmergencyContact $contact): JsonResponse
    {
        $updated = $this->service->update($contact, UpdateEmergencyContactDTO::fromRequest($request));
        return response()->json(['data' => new AdminEmergencyContactResource($updated)]);
    }

    /** DELETE /api/admin/v1/emergency/contacts/{contact} */
    public function destroy(EmergencyContact $contact): JsonResponse
    {
        $this->service->destroy($contact);
        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/emergency/contacts/{id}/restore */
    public function restore(int $id): JsonResponse
    {
        /** @var EmergencyContact $contact */
        $contact = EmergencyContact::withTrashed()->findOrFail($id);
        $restored = $this->service->restore($contact);
        return response()->json(['data' => new AdminEmergencyContactResource($restored)]);
    }

    /** POST /api/admin/v1/emergency/contacts/{contact}/photos */
    public function uploadPhotos(Request $request, EmergencyContact $contact): JsonResponse
    {
        $request->validate([
            'photos'   => ['required', 'array', 'min:1', 'max:10'],
            'photos.*' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $photos = $this->service->uploadPhotos($contact, $request->file('photos'));
        return response()->json(['data' => EmergencyContactPhotoResource::collection($photos)], 201);
    }

    /** DELETE /api/admin/v1/emergency/contacts/{contact}/photos/{photo} */
    public function deletePhoto(EmergencyContact $contact, EmergencyContactPhoto $photo): JsonResponse
    {
        abort_if($photo->emergency_contact_id !== $contact->id, 404);
        $this->service->deletePhoto($photo);
        return response()->json(null, 204);
    }

    /** PATCH /api/admin/v1/emergency/contacts/{contact}/photos/reorder */
    public function reorderPhotos(Request $request, EmergencyContact $contact): JsonResponse
    {
        $request->validate([
            'ids'   => ['required', 'array'],
            'ids.*' => ['required', 'integer'],
        ]);

        $photos = $this->service->reorderPhotos($contact, $request->input('ids'));
        return response()->json(['data' => EmergencyContactPhotoResource::collection($photos)]);
    }
}
