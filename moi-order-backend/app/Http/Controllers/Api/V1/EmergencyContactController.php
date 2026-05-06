<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\EmergencyContactType;
use App\Http\Controllers\Controller;
use App\Http\Resources\EmergencyContactResource;
use App\Models\EmergencyContact;
use App\Services\EmergencyContactService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — HTTP layer only. Public, no auth required.
 */
class EmergencyContactController extends Controller
{
    public function __construct(private readonly EmergencyContactService $service) {}

    /** GET /api/v1/emergency/contacts?type=hospital&per_page=20 */
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'type'     => ['required', 'string', Rule::enum(EmergencyContactType::class)],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $type    = EmergencyContactType::from($validated['type']);
        $perPage = (int) ($validated['per_page'] ?? 20);

        $contacts = $this->service->listByType($type, $perPage);

        return EmergencyContactResource::collection($contacts);
    }

    /** GET /api/v1/emergency/contacts/{contact} */
    public function show(EmergencyContact $contact): JsonResponse
    {
        if (! $contact->is_active) {
            abort(404);
        }

        return response()->json([
            'data' => new EmergencyContactResource($this->service->showForUser($contact)),
        ]);
    }
}
