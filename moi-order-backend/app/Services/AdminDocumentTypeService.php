<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreDocumentTypeDTO;
use App\DTOs\AdminUpdateDocumentTypeDTO;
use App\Models\DocumentType;
use App\Support\CacheKeys;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

class AdminDocumentTypeService
{
    public function index(int $perPage = 20): LengthAwarePaginator
    {
        return DocumentType::withTrashed()->latest()->paginate($perPage);
    }

    public function all(): Collection
    {
        return Cache::remember(CacheKeys::DOCUMENT_TYPES_ACTIVE, now()->addDays(7), fn (): Collection =>
            DocumentType::active()->orderBy('name_en')->get()
        );
    }

    public function store(AdminStoreDocumentTypeDTO $dto): DocumentType
    {
        $documentType = DocumentType::create([
            'slug'      => $dto->slug,
            'name_en'   => $dto->nameEn,
            'name_mm'   => $dto->nameMm,
            'is_active' => $dto->isActive,
        ]);

        Cache::forget(CacheKeys::DOCUMENT_TYPES_ACTIVE);

        return $documentType;
    }

    public function update(DocumentType $documentType, AdminUpdateDocumentTypeDTO $dto): DocumentType
    {
        $documentType->update([
            'name_en'   => $dto->nameEn,
            'name_mm'   => $dto->nameMm,
            'is_active' => $dto->isActive,
        ]);

        Cache::forget(CacheKeys::DOCUMENT_TYPES_ACTIVE);

        return $documentType->fresh();
    }

    public function destroy(DocumentType $documentType): void
    {
        $documentType->delete();
        Cache::forget(CacheKeys::DOCUMENT_TYPES_ACTIVE);
    }

    public function restore(int $id): DocumentType
    {
        $documentType = DocumentType::withTrashed()->findOrFail($id);
        $documentType->restore();

        Cache::forget(CacheKeys::DOCUMENT_TYPES_ACTIVE);

        return $documentType->fresh();
    }
}
