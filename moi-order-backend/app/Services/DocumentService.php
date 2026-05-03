<?php

declare(strict_types=1);

namespace App\Services;

use App\Contracts\DocumentOcrInterface;
use App\Contracts\FileStorageInterface;
use App\Enums\DocumentType;
use App\Exceptions\DomainException;
use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

/**
 * Principle: SRP — owns document lifecycle: OCR → store → persist → delete.
 * Principle: DIP — depends on DocumentOcrInterface and FileStorageInterface abstractions.
 */
class DocumentService
{
    public function __construct(
        private readonly DocumentOcrInterface $ocr,
        private readonly FileStorageInterface $storage,
        private readonly DocumentUploadLimiterService $limiter,
    ) {}

    /**
     * OCR happens before storage so a failed analysis produces no orphaned files.
     * Rate limit is checked before OCR to avoid wasting Claude API credits.
     *
     * @return array{ document: Document, quota: array }
     * @throws DomainException 429 when daily or monthly quota is exhausted
     */
    public function upload(User $user, UploadedFile $file, DocumentType $type): array
    {
        if (! $this->limiter->isAllowed($user)) {
            throw new DomainException('document.upload_limit_exceeded', 429);
        }

        $result = $this->ocr->analyze($file, $type);

        $document = DB::transaction(function () use ($user, $file, $type, $result): Document {
            $path = $this->storage->store(
                $file,
                "documents/{$user->id}",
                ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
            );

            return Document::create([
                'user_id'            => $user->id,
                'type'               => $type->value,
                'file_path'          => $path,
                'subtype'            => $result->subtype,
                'extracted_data'     => $result->extractedData,
                'expiry_date'        => $result->expiryDate,
                'extension_date'     => $result->extensionDate,
                'is_valid_type'      => $result->isValidDocumentType,
                'validation_message' => $result->validationMessage,
            ]);
        });

        // Increment only after a successful upload so failed attempts don't count.
        $this->limiter->increment($user, $type);

        return ['document' => $document, 'quota' => $this->limiter->getStats($user)];
    }

    public function getUploadStats(User $user): array
    {
        return $this->limiter->getStats($user);
    }

    /** @return Collection<int, Document> */
    public function listForUser(User $user, DocumentType $type): Collection
    {
        return Document::query()
            ->forUser($user->id)
            ->ofType($type)
            ->latest()
            ->get();
    }

    public function delete(User $user, int $documentId): void
    {
        $document = Document::query()
            ->forUser($user->id)
            ->findOrFail($documentId);

        DB::transaction(function () use ($document): void {
            if ($document->file_path) {
                $this->storage->delete($document->file_path);
            }
            $document->delete();
        });
    }
}
