<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin\V1;

use App\Contracts\FileStorageInterface;
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
 * Principle: SRP — admin CRUD over a user's documents.
 * Security:
 *   - destroy(): admin-created records only; user-uploaded files are user-owned.
 *   - update(): admin may edit metadata on ANY document (fix OCR errors).
 *   - file uploads go through FileStorageInterface — never direct Storage calls.
 */
class AdminUserDocumentController extends Controller
{
    public function __construct(private readonly FileStorageInterface $storage) {}

    /** GET /api/admin/v1/users/{user}/documents */
    public function index(User $user): AnonymousResourceCollection
    {
        return AdminUserDocumentResource::collection(
            $user->documents()->latest()->get()
        );
    }

    /** POST /api/admin/v1/users/{user}/documents */
    public function store(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'type'               => ['required', 'string', Rule::enum(DocumentType::class)],
            'subtype'            => ['required', 'string', 'max:100'],
            'expiry_date'        => ['nullable', 'date'],
            'extension_date'     => ['nullable', 'date'],
            'is_valid_type'      => ['nullable', 'boolean'],
            'validation_message' => ['nullable', 'string', 'max:500'],
            'extracted_data'     => ['nullable', 'array'],
            'extracted_data.*'   => ['nullable', 'string', 'max:500'],
            'image'              => ['nullable', 'image', 'max:10240'],
        ]);

        $filePath = null;
        if ($request->hasFile('image')) {
            // image/heif = iPhone HEIC variant; image/heic = explicit HEIC
            $filePath = $this->storage->store(
                $request->file('image'),
                'documents/' . $user->id,
                ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
            );
        }

        $document = DB::transaction(function () use ($validated, $user, $filePath): Document {
            return $user->documents()->create([
                'type'               => $validated['type'],
                'subtype'            => $validated['subtype'],
                'expiry_date'        => $validated['expiry_date'] ?? null,
                'extension_date'     => $validated['extension_date'] ?? null,
                'is_valid_type'      => $validated['is_valid_type'] ?? true,
                'validation_message' => $validated['validation_message'] ?: null,
                'extracted_data'     => $validated['extracted_data'] ?? null,
                'file_path'          => $filePath,
                'is_admin_created'   => true,
            ]);
        });

        DB::afterCommit(function () use ($user, $document): void {
            try {
                $user->notify(new AdminDocumentActionNotification('added', $document->type->label()));
                event(new UserNotificationReceived($user));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('AdminUserDocumentController: notify failed on store', [
                    'user_id' => $user->id, 'error' => $e->getMessage(),
                ]);
            }
        });

        return response()->json(['data' => new AdminUserDocumentResource($document)], 201);
    }

    /** PATCH /api/admin/v1/users/{user}/documents/{document} — edit any doc's metadata */
    public function update(Request $request, User $user, Document $document): JsonResponse
    {
        if ($document->user_id !== $user->id) {
            abort(404);
        }

        $validated = $request->validate([
            'type'               => ['sometimes', 'string', Rule::enum(DocumentType::class)],
            'subtype'            => ['nullable', 'string', 'max:100'],
            'expiry_date'        => ['nullable', 'date'],
            'extension_date'     => ['nullable', 'date'],
            'is_valid_type'      => ['nullable', 'boolean'],
            'validation_message' => ['nullable', 'string', 'max:500'],
            'extracted_data'     => ['nullable', 'array'],
            'extracted_data.*'   => ['nullable', 'string', 'max:500'],
            'image'              => ['nullable', 'image', 'max:10240'],
        ]);

        $filePath = $document->file_path;
        if ($request->hasFile('image')) {
            $filePath = $this->storage->store(
                $request->file('image'),
                'documents/' . $user->id,
                ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'],
            );
        }

        DB::transaction(function () use ($validated, $document, $filePath): void {
            $updates = array_filter([
                'type'           => $validated['type']          ?? null,
                'subtype'        => $validated['subtype']        ?? null,
                'expiry_date'    => $validated['expiry_date']    ?? null,
                'extension_date' => $validated['extension_date'] ?? null,
                'is_valid_type'  => $validated['is_valid_type']  ?? null,
                'file_path'      => $filePath,
            ], fn ($v) => $v !== null);

            // validation_message is always sent by the frontend ('' = clear it).
            // Must be set outside array_filter so it can be explicitly nulled.
            if (array_key_exists('validation_message', $validated)) {
                $updates['validation_message'] = $validated['validation_message'] ?: null;
            }

            if (array_key_exists('extracted_data', $validated)) {
                // Merge so existing OCR keys not included in the patch are preserved.
                $updates['extracted_data'] = array_merge(
                    $document->extracted_data ?? [],
                    $validated['extracted_data'] ?? [],
                );
            }

            $document->update($updates);
        });

        return response()->json(['data' => new AdminUserDocumentResource($document->fresh())]);
    }

    /** DELETE /api/admin/v1/users/{user}/documents/{document} — admin-created records only */
    public function destroy(User $user, Document $document): JsonResponse
    {
        if ($document->user_id !== $user->id) {
            abort(404);
        }

        if (! $document->is_admin_created) {
            abort(403, 'Cannot delete user-uploaded documents.');
        }

        $typeLabel = $document->type->label();

        DB::transaction(fn () => $document->delete());

        DB::afterCommit(function () use ($user, $typeLabel): void {
            try {
                $user->notify(new AdminDocumentActionNotification('removed', $typeLabel));
                event(new UserNotificationReceived($user));
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('AdminUserDocumentController: notify failed on destroy', [
                    'user_id' => $user->id, 'error' => $e->getMessage(),
                ]);
            }
        });

        return response()->json(null, 204);
    }
}
