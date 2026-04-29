<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\DocumentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\UploadDocumentRequest;
use App\Http\Resources\DocumentResource;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;

class DocumentController extends Controller
{
    public function __construct(private readonly DocumentService $service) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'type' => ['required', 'string', new Enum(DocumentType::class)],
        ]);

        $type      = DocumentType::from($request->string('type')->toString());
        $documents = $this->service->listForUser($request->user(), $type);

        return response()->json(['data' => DocumentResource::collection($documents)]);
    }

    public function store(UploadDocumentRequest $request): JsonResponse
    {
        $type     = DocumentType::from($request->string('type')->toString());
        $document = $this->service->upload($request->user(), $request->file('image'), $type);

        return response()->json(['data' => new DocumentResource($document)], 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->service->delete($request->user(), $id);

        return response()->json(null, 204);
    }
}
