<?php

declare(strict_types=1);

namespace App\DTOs;

readonly class OcrResult
{
    public function __construct(
        public bool    $isValidDocumentType,
        public ?string $validationMessage,
        public ?string $subtype,
        public array   $extractedData,
        public ?string $expiryDate,
        public ?string $extensionDate,
    ) {}

    public static function invalid(string $message): self
    {
        return new self(
            isValidDocumentType: false,
            validationMessage:   $message,
            subtype:             null,
            extractedData:       [],
            expiryDate:          null,
            extensionDate:       null,
        );
    }
}
