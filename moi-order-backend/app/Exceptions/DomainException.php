<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * Represents a business rule violation.
 * Thrown from Service layer; mapped to HTTP 409 (or custom status) in bootstrap/app.php.
 * Principle: SRP — carries domain error code + HTTP status + optional client context.
 * Context is supplemental read-only data for the client (e.g. suspended_until date).
 */
final class DomainException extends RuntimeException
{
    /** @param array<string, mixed> $context */
    public function __construct(
        string $code,
        private readonly int $status = 409,
        private readonly array $context = [],
    ) {
        parent::__construct($code);
    }

    public function getStatus(): int
    {
        return $this->status;
    }

    /** @return array<string, mixed> */
    public function getContext(): array
    {
        return $this->context;
    }
}
