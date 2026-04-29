<?php

declare(strict_types=1);

namespace App\Contracts;

use App\DTOs\OcrResult;
use App\Enums\DocumentType;
use Illuminate\Http\UploadedFile;

/**
 * Principle: ISP — single-method contract covering all document types
 *   via the DocumentType parameter; callers only depend on this abstraction.
 */
interface DocumentOcrInterface
{
    /**
     * Analyse an uploaded image and return structured OCR results.
     * Always returns an OcrResult — never throws on OCR failure (returns invalid result).
     */
    public function analyze(UploadedFile $file, DocumentType $type): OcrResult;
}
