<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\AdminStoreDocumentTypeDTO;
use App\DTOs\AdminUpdateDocumentTypeDTO;
use App\Models\DocumentType;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AdminDocumentTypeService
{
    public function index(int $perPage = 20): LengthAwarePaginator
    {
        return DocumentType::withTrashed()->latest()->paginate($perPage);
    }

    public function all(): Collection
    {
        return DocumentType::active()->orderBy('name_en')->get();
    }

    public function store(AdminStoreDocumentTypeDTO $dto): DocumentType
    {
        return DocumentType::create([
            'slug'      => $dto->slug,
            'name_en'   => $dto->nameEn,
            'name_mm'   => $dto->nameMm,
            'is_active' => $dto->isActive,
        ]);
    }

    public function update(DocumentType $documentType, AdminUpdateDocumentTypeDTO $dto): DocumentType
    {
        $documentType->update([
            'name_en'   => $dto->nameEn,
            'name_mm'   => $dto->nameMm,
            'is_active' => $dto->isActive,
        ]);

        return $documentType->fresh();
    }

    public function destroy(DocumentType $documentType): void
    {
        $documentType->delete();
    }

    public function restore(int $id): DocumentType
    {
        $documentType = DocumentType::withTrashed()->findOrFail($id);
        $documentType->restore();

        return $documentType->fresh();
    }
}
