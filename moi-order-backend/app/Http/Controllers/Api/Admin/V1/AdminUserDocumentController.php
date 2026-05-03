<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Enums\DocumentType;
use App\Events\UserNotificationReceived;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminUserDocumentResource;
use App\Models\Document;
use App\Models\User;
use App\Notifications\AdminDocumentActionNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * Principle: SRP — admin CRUD over a user's documents only.
 * Security: document file_path is encrypted; never returned to client.
 */
class AdminUserDocumentController extends Controller
{
    /** GET /api/admin/v1/users/{user}/documents */
    public function index(User $user): AnonymousResourceCollection
    {
        $documents = $user->documents()->latest()->get();

        return AdminUserDocumentResource::collection($documents);
    }

    /** POST /api/admin/v1/users/{user}/documents */
    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'type'               => ['required', 'string', Rule::enum(DocumentType::class)],
            'subtype'            => ['nullable', 'string', 'max:100'],
            'expiry_date'        => ['nullable', 'date'],
            'extension_date'     => ['nullable', 'date'],
            'is_valid_type'      => ['nullable', 'boolean'],
            'validation_message' => ['nullable', 'string', 'max:500'],
        ]);

        $document = DB::transaction(function () use ($validated, $user): Document {
            return $user->documents()->create([
                'type'               => $validated['type'],
                'subtype'            => $validated['subtype'] ?? null,
                'expiry_date'        => $validated['expiry_date'] ?? null,
                'extension_date'     => $validated['extension_date'] ?? null,
                'is_valid_type'      => $validated['is_valid_type'] ?? true,
                'validation_message' => $validated['validation_message'] ?? null,
                'file_path'          => '',
            ]);
        });

        DB::afterCommit(function () use ($user, $document): void {
            $typeLabel = $document->type->label();
            $user->notify(new AdminDocumentActionNotification('added', $typeLabel));
            event(new UserNotificationReceived($user));
        });

        return response()->json(['data' => new AdminUserDocumentResource($document)], 201);
    }

    /** DELETE /api/admin/v1/users/{user}/documents/{document} */
    public function destroy(User $user, Document $document): JsonResponse
    {
        if ($document->user_id !== $user->id) {
            abort(404);
        }

        $typeLabel = $document->type->label();

        DB::transaction(fn () => $document->delete());

        DB::afterCommit(function () use ($user, $typeLabel): void {
            $user->notify(new AdminDocumentActionNotification('removed', $typeLabel));
            event(new UserNotificationReceived($user));
        });

        return response()->json(null, 204);
    }
}
